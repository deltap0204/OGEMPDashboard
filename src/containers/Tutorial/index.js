import React from 'react';
import { withRouter } from 'react-router-dom';
import { Box } from '@material-ui/core';
import useStyles from './style';

const TutorialContainer = ({ history }) => {
  const classes = useStyles();
  console.log(history);

  return <Box className={classes.root}>Tutorial Container</Box>;
};

export default withRouter(TutorialContainer);
