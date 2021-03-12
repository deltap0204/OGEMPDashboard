import React from 'react';
import { Box, Divider, Typography } from '@material-ui/core';
import { useStateContext } from '@app/providers/StateContext';
import useStyles from './style';
import versionData from '@app/version.json';

const GlobalStatus = ({ width }) => {
  const classes = useStyles();
  const [stateContext] = useStateContext();

  return (
    <Box className={classes.root}>
      <Divider />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pl={3}
        pr={3}
        height={40}
      >
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
        <p className={classes.p}>
          <b>Version: {versionData?.version || 'null'}</b> &nbsp;
          <b>Branch: {versionData?.branch || 'null'}</b>
        </p>
      </Box>
    </Box>
  );
};

export default GlobalStatus;
