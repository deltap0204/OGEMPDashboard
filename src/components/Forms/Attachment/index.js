import React, { useState, useEffect, createRef } from 'react';
import clsx from 'clsx';
import {
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import {
  faPaperclip,
  faImage,
  faFilm,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import { CloudUpload, Delete, GetApp } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSnackbar } from 'notistack';
import { LoadingCard } from '@app/components/Cards';
import { CustomInput, CustomDialog } from '@app/components/Custom';
import { generateSignedUrl, axiosPutRequest } from '@app/utils/functions';
import { getCurrentUTCTime } from '@app/utils/date-manager';
import { getFileExtension } from '@app/utils/file-manager';
import config from '@app/Config';
import AttachmentPreview from './Preview';
import useStyles from './style';

const getIcon = (type) => {
  if (
    type === 'video/x-msvideo' ||
    type === 'video/mpeg' ||
    type === 'video/mp4'
  )
    return faFilm;
  if (type === 'image/png' || type === 'image/jpeg') return faImage;
  if (type === 'application/pdf') return faFilePdf;

  return faPaperclip;
};

const AttachmentForm = ({ disable, docId, resources, onChange }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const refUpload = createRef(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [isDropping, setIsDropping] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [selected, setSelected] = useState();
  const [openPreview, setOpenPreview] = useState(false);
  const [fileInfo, setFileInfo] = useState({
    type: null,
    name: '',
    url: ''
  });
  const [openCreate, setOpenCreate] = useState(false);
  const [loadedData, setLoadedData] = useState([]);

  useEffect(() => {
    setLoadedData(resources?.internal || []);
  }, [resources]);

  const handleElClick = (type, value, index) => {
    if (type === 'doubleClick') setOpenPreview(true);

    setSelected(index);
    setCanDelete(true);
    setFileInfo({
      ...fileInfo,
      name: value.name,
      type: value.type,
      url: value.url
    });
  };

  const handleInputChange = (type, field, value) => {
    if (type === 'upload') {
      if (value.target.files.length === 1) {
        setFile(value.target.files[0]);
        setOpenCreate(true);
        setFileInfo({
          name: '',
          url: '',
          type: ''
        });
      }
    }

    if (type === 'createDialog') {
      setFileInfo({
        ...fileInfo,
        [field]: value
      });
    }

    if (type === 'previewDialog') {
      setFileInfo({
        ...fileInfo,
        [field]: value
      });
    }
  };

  const handleDrag = (type, event) => {
    event.preventDefault();
    event.stopPropagation();
    if (type === 'leave') setIsDropping(false);
    if (type === 'over') setIsDropping(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDropping(false);
    if (event.dataTransfer.files.length !== 1) {
      enqueueSnackbar('Just one file allowed', { variant: 'warning' });
      return;
    }

    setFile(event.dataTransfer.files[0]);
    setOpenCreate(true);
  };

  const handleFormAction = async (type) => {
    try {
      if (type === 'upload') {
        refUpload.current.click();
        setFileInfo({
          name: '',
          url: '',
          type: ''
        });
      }

      if (type === 'download') {
        const elDom = document.createElement('a');
        elDom.setAttribute('href', fileInfo.url);
        elDom.setAttribute('download', '');
        elDom.setAttribute('rel', 'noopener noreferrer');
        elDom.click();
      }
      if (type === 'delete') {
        onChange('delete', loadedData[selected]);
        setSelected();
        setFileInfo({
          name: '',
          url: '',
          type: ''
        });
      }
    } catch (error) {
      console.log(error.message);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handlePreviewDialogChange = (type, value) => {
    if (type === 'btnClick') {
      if (value) {
        if (!disable) onChange('update', fileInfo);
        setSelected();
        setFileInfo({
          name: '',
          url: '',
          type: ''
        });
      }
      setOpenPreview(false);
    }
  };

  const handleCreateDialogChange = async (type, value) => {
    try {
      if (value) {
        if (file) {
          setLoading(true);
          const fileExt = getFileExtension(file.name);
          const fileName = getCurrentUTCTime();
          const { signedUrl } = await generateSignedUrl(
            docId,
            `${fileName}.${fileExt}`
          );

          await axiosPutRequest(signedUrl, file);

          onChange('upload', [
            ...loadedData,
            {
              ...fileInfo,
              type: file.type,
              url: `${config.assetUrl}/${docId}/${fileName}.${fileExt}`
            }
          ]);

          setLoading(false);
          enqueueSnackbar('Successfully uploaded!', { variant: 'success' });
        }
      }
      setOpenCreate(false);
      setFile();
      setSelected();
      setFileInfo({
        name: '',
        url: '',
        type: ''
      });
    } catch (error) {
      console.log(error.message);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  return (
    <LoadingCard
      loading={loading}
      style={classes.root}
      onDragOver={(e) => disable || handleDrag('over', e)}
      onDragLeave={(e) => disable || handleDrag('leave', e)}
      onDrop={handleDrop}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
          <FontAwesomeIcon icon={faPaperclip} className={classes.icon} />
          Attachments
        </Typography>
        {isDropping || (
          <Box>
            <IconButton
              className={classes.actionButton}
              size="small"
              onClick={() => handleFormAction('upload')}
              disabled={disable}
            >
              <CloudUpload />
            </IconButton>
            <IconButton
              className={classes.actionButton}
              size="small"
              onClick={() => handleFormAction('download')}
              disabled={!canDelete}
            >
              <GetApp />
            </IconButton>
            <IconButton
              className={classes.actionButton}
              size="small"
              onClick={() => handleFormAction('delete')}
              disabled={!canDelete || disable}
            >
              <Delete />
            </IconButton>
          </Box>
        )}
      </Box>
      <Divider className={classes.separator} />
      <input
        type="file"
        id="file"
        ref={refUpload}
        onChange={(e) => handleInputChange('upload', 'file', e)}
        style={{ display: 'none' }}
      />
      <main
        className={clsx(classes.content, {
          [classes.content]: !isDropping,
          [classes.contendDroping]: isDropping
        })}
      >
        {isDropping ? (
          <FontAwesomeIcon icon={faPaperclip} size="6x" />
        ) : (
          <List>
            {loadedData &&
              loadedData.map((el, index) => (
                <ListItem
                  key={index}
                  className={clsx(classes.listItems, {
                    [classes.listItem]: selected !== index,
                    [classes.listItemSelected]: selected === index
                  })}
                  onClick={() => handleElClick('singleClick', el, index)}
                  onDoubleClick={() => handleElClick('doubleClick', el, index)}
                >
                  <ListItemText className={classes.listItemText}>
                    <Typography variant="subtitle1">
                      <FontAwesomeIcon icon={getIcon(el.type)} />
                      &nbsp; {el.name}
                    </Typography>
                  </ListItemText>
                </ListItem>
              ))}
          </List>
        )}
      </main>
      <CustomDialog
        mainBtnName={disable ? null : 'Update'}
        open={openPreview}
        title="Preview"
        onChange={handlePreviewDialogChange}
      >
        <CustomInput
          label="File Name"
          variant="outlined"
          size="small"
          type="text"
          resources={fileInfo.name}
          style={classes.inputArea}
          disabled={disable}
          onChange={(value) =>
            handleInputChange('previewDialog', 'name', value)
          }
        />
        <CustomInput
          label="File URL"
          variant="outlined"
          size="small"
          type="text"
          resources={fileInfo.url}
          style={classes.inputArea}
          disabled={true}
          onChange={(value) => handleInputChange('previewDialog', 'url', value)}
        />
        <AttachmentPreview resources={fileInfo} />
      </CustomDialog>
      <CustomDialog
        open={openCreate}
        title="Input the attachment name"
        mainBtnName="Submit"
        onChange={handleCreateDialogChange}
      >
        <CustomInput
          label="File Name"
          variant="outlined"
          size="small"
          helperText="Input more than 5 charactor"
          style={classes.inputArea}
          resources={fileInfo.name}
          onChange={(value) => handleInputChange('createDialog', 'name', value)}
        />
      </CustomDialog>
    </LoadingCard>
  );
};

export default AttachmentForm;
