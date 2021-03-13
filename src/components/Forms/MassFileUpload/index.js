import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { Box, Typography } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { LoadingCard } from '@app/components/Cards';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { generateSignedUrl } from '@app/utils/functions';
import { getCurrentUTCTime } from '@app/utils/date-manager';
import { getFileExtension } from '@app/utils/file-manager';
import { getBase64 } from '@app/utils/file-manager';
import config from '@app/Config';
import useStyles from './style';

const MassFileUploadForm = ({ docId, onChange }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);

  const onDrop = useCallback(async (files) => {
    try {
      setLoading(true);
      const fileExt = getFileExtension(files[0].name);
      const fileName = getCurrentUTCTime();
      const base64string = await getBase64(files[0]);
      const { signedUrl } = await generateSignedUrl(
        docId,
        `${fileName}.${fileExt}`
      );

      await axios({
        method: 'put',
        url: `${config.dev.corsHandler}${signedUrl}`,
        data: base64string,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          setPercentage((progressEvent.loaded * 100) / progressEvent.total);
        }
      });
      onChange(`${config.assetUrl}/${docId}/${fileName}.${fileExt}`);
      enqueueSnackbar('Successfully uploaded!', { variant: 'success' });
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    // Do something with the files
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: '.csv'
  });

  return (
    <LoadingCard loading={loading} percentage={percentage} isProgress={true}>
      <Box
        {...getRootProps()}
        className={clsx(classes.dropzone, {
          [classes.dropzone]: !isDragActive,
          [classes.dropzoneDragging]: isDragActive
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography variant="subtitle1" className={classes.dropzoneParagraph}>
            Drop the file here ...
          </Typography>
        ) : (
          <Typography variant="subtitle1" className={classes.dropzoneParagraph}>
            Upload the file
          </Typography>
        )}
      </Box>
    </LoadingCard>
  );
};

export default MassFileUploadForm;
