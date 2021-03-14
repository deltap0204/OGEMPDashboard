import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Typography } from '@material-ui/core';

const UserProfile = () => {
  return (
    <>
      <Grid>
        <Typography variant="h6" style={{ color: 'white' }}>
          alpha@gmail.com
        </Typography>
        <Grid>
          <Grid></Grid>
          <Grid></Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default UserProfile;
