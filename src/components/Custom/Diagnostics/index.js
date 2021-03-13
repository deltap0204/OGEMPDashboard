import React from 'react';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';
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
import { TempGlobalStatus } from '@app/components/Temp';
const DiagnosticsDialog = ({ open, title, style, children, setOpenDialog }) => {
  const classes = useStyles();

  return (
    <Dialog
      classes={{ paper: classes.paper }}
      className={clsx(classes.root, {
        [classes.root]: !style,
        [style]: style
      })}
      open={open}
    >
      <DialogTitle className={classes.title}>
        <Box>
          <Typography variant="h6">{title}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <TempGlobalStatus />

        {children}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setOpenDialog(false);
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DiagnosticsDialog;
