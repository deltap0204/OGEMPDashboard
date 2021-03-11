import React from 'react';
import { Box } from '@material-ui/core';
import useStyles from './style';

const DashboardContainer = () => {
  const classes = useStyles();
  return <Box className={classes.root}>Dashboard Container</Box>;
};

export default DashboardContainer;
