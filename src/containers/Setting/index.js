import React from 'react';
import { withRouter } from 'react-router-dom';
import { Box } from '@material-ui/core';
import useStyles from './style';

const SettingContainer = ({ history }) => {
  const classes = useStyles();
  console.log(history);

  return <Box className={classes.root}>Setting Container</Box>;
};

export default withRouter(SettingContainer);
