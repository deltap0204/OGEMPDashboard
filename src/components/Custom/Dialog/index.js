import React from 'react';
import clsx from 'clsx';
import {
  Box,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent
} from '@material-ui/core';
import useStyles from './style';

const CustomDialog = ({
  open,
  title,
  style,
  mainBtnName,
  secondaryBtnName,
  onChange,
  children
}) => {
  const classes = useStyles();

  return (
    <Dialog
      className={clsx(classes.root, {
        [classes.root]: !style,
        [style]: style
      })}
      open={open}
      onClose={() => onChange('btnClick', false)}
    >
      <DialogTitle className={classes.title}>
        <Box>
          <Typography variant="h6">{title}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent className={classes.content}>{children}</DialogContent>
      <DialogActions>
        <Button color="default" onClick={() => onChange('btnClick', false)}>
          {secondaryBtnName || 'Cancel'}
        </Button>
        <Button color="primary" onClick={() => onChange('btnClick', true)}>
          {mainBtnName}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
