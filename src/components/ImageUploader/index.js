import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { DropzoneArea } from 'material-ui-dropzone';
import {
  Box,
  IconButton,
  LinearProgress,
  CircularProgress
} from '@material-ui/core';
import { Img } from 'react-image';
import { Close } from '@material-ui/icons';
import { getBase64 } from '@app/utils/file-manager';
import useStyles from './style';
import { useSnackbar } from 'notistack';
import { uploadFileToS3 } from '@app/utils/file-manager';
import { getCurrentUTCTime } from '@app/utils/date-manager';
import './style.css';

const ImageUploader = ({
  disable,
  acceptedFiles,
  updateAvatarS3URL,
  avatarS3URL,
  resourceID,
  resourceName
}) => {
  const [file, setFile] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const [base64string, setBase64String] = useState(() => avatarS3URL || '');
  const classes = useStyles();

  useEffect(() => {
    setBase64String(avatarS3URL || '');
    setFile();
  }, [avatarS3URL]);

  const handleChange = async (files) => {
    try {
      setFile(files[0]);
      if (files.length > 0) {
        const base64string = await getBase64(files[0]);
        setBase64String(base64string);
        const fileName = getCurrentUTCTime();
        const imageURL = await uploadFileToS3(
          fileName,
          files[0],
          resourceID,
          resourceName
        );
        updateAvatarS3URL(imageURL);
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleClose = () => {
    setFile();
    updateAvatarS3URL();
    setBase64String('');
  };

  return (
    <Box
      className={clsx({
        [classes.root]: !disable,
        [classes.preview]: disable
      })}
    >
      {disable ? (
        <div>preview</div>
      ) : file || base64string ? (
        <React.Fragment>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            className={classes.imageArea}
          >
            <Img
              src={base64string}
              className={classes.media}
              loader={<CircularProgress />}
            />
            <IconButton className={classes.closeButton} onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
        </React.Fragment>
      ) : (
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
      )}
    </Box>
  );
};

export default ImageUploader;
