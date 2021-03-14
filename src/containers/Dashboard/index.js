import React, { useState } from 'react';
import { Box, Button } from '@material-ui/core';
import useStyles from './style';
import Typography from '@material-ui/core/Typography';
const DashboardContainer = () => {
  const classes = useStyles();
  const [openCreate, setOpenDialog] = useState(false);
  return (
    <Box className={classes.root}>
      <Typography l="4rem" variant="h4" gutterBottom>
        Dashboard Container
      </Typography>
    </Box>
  );
};

export default DashboardContainer;
