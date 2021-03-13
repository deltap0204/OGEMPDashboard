import React, { useState } from 'react';
import { Box, Button } from '@material-ui/core';
import useStyles from './style';
import { DiagnosticsDialog } from '@app/components/Custom';

const DashboardContainer = () => {
  const classes = useStyles();
  const [openCreate, setOpenDialog] = useState(false);
  return (
    <Box className={classes.root}>
      Dashboard Container
      <Button onClick={() => setOpenDialog(true)}>View Diagnostics</Button>
      <DiagnosticsDialog
        open={openCreate}
        title="Diagnostics"
        setOpenDialog={setOpenDialog}
      ></DiagnosticsDialog>
    </Box>
  );
};

export default DashboardContainer;
