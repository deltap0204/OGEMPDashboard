import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import versionData from '@app/version.json';

const useStyles = makeStyles((theme) => ({
  Dialog: {
    marginLeft: '75vw',
    marginTop: '50vh'
  },
  IconButton: {
    float: 'right',
    marginTop: '-1vh'
  }
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [stateContext, setStateContext] = React.useState(props.stateContext);
  const handleClose = () => {
    setOpen(false);

    setInterval(props.sliderClicked(), 3000);
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        className={classes.Dialog}
      >
        <DialogTitle id="alert-dialog-slide-title">
          Diagnosticss
          <IconButton className={classes.IconButton} aria-label="delete">
            <CloseOutlinedIcon onClick={handleClose} fontSize="medium" />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Typography variant="subtitle1">
              <em>
                <b>State: </b>
              </em>
              {stateContext.state?.name || 'null'} &nbsp;
              <em>
                <b>Station: </b>
              </em>
              {stateContext.station?.name || 'null'} &nbsp;
              <em>
                <b>District: </b>
              </em>
              {stateContext.district?.name || 'null'} &nbsp;
              <em>
                <b>School: </b>
              </em>
              {stateContext.school?.name || 'null'} &nbsp;
              <em>
                <b>Class: </b>
              </em>
              {stateContext.class?.name || 'null'} &nbsp;
            </Typography>
            <p>
              <b>Version: {versionData?.version || 'null'}</b> &nbsp;
              <b>Branch: {versionData?.branch || 'null'}</b>
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
}
