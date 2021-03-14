import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { DropzoneArea } from 'material-ui-dropzone';
import { Box, IconButton, LinearProgress } from '@material-ui/core';
import { Img } from 'react-image';
import { Close } from '@material-ui/icons';
import { DefaultCard, LoadingCard } from '@app/components/Cards';
import { getBase64 } from '@app/utils/file-manager';
import useStyles from './style';
import { useSnackbar } from 'notistack';
import { generateSignedUrl, axiosPutRequest } from '@app/utils/functions';
import { getCurrentUTCTime } from '@app/utils/date-manager';
import { getFileExtension } from '@app/utils/file-manager';
import config from '@app/Config';
import './style.css';

const AvatarUploadForm = ({
  disable,
  docId,
  resources,
  acceptedFiles,
  onChange
}) => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [loadedData, setLoadedData] = useState('');
  const classes = useStyles();

  useEffect(() => {
    setLoadedData(resources);
  }, [resources]);

  const handleChange = async (files) => {
    try {
      if (files.length > 0) {
        setLoading(true);
        const base64string = await getBase64(files[0]);
        setLoadedData(base64string);
        const fileExt = getFileExtension(files[0].name);
        const fileName = getCurrentUTCTime();
        const { signedUrl } = await generateSignedUrl(
          docId,
          `${fileName}.${fileExt}`
        );

        await axiosPutRequest(signedUrl, files[0]);
        onChange(`${config.assetUrl}/${docId}/${fileName}.${fileExt}`);
        setLoading(false);
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleClose = () => {
    setLoadedData('');
    onChange('remove');
  };

  return (
    <Box
      className={clsx({
        [classes.root]: !disable,
        [classes.preview]: disable
      })}
    >
      {disable ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          className={classes.imageArea}
        >
          <Img
            src={resources}
            className={classes.media}
            loader={<LinearProgress />}
          />
        </Box>
      ) : loadedData ? (
        <LoadingCard loading={loading} style={classes.preview} isShadow={false}>
          <Img
            src={loadedData}
            className={classes.media}
            loader={<LinearProgress />}
          />
          <IconButton className={classes.closeButton} onClick={handleClose}>
            <Close />
          </IconButton>
        </LoadingCard>
      ) : (
        <DefaultCard className={classes.dropzoneCard}>
          <DropzoneArea
            dropzoneText="Drag and Drop an Image"
            dropzoneClass={classes.dropzone}
            dropzoneParagraphClass={classes.dropzoneParagraph}
            showPreviewsInDropzone={false}
            showPreviews={false}
            acceptedFiles={acceptedFiles ? acceptedFiles : ['image/*']}
            filesLimit={1}
            onChange={handleChange}
          />
        </DefaultCard>
      )}
    </Box>
  );
};

export default AvatarUploadForm;
