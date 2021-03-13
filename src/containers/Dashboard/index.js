import React, { useState } from 'react';
import { Box, Button } from '@material-ui/core';
import useStyles from './style';
import { DiagnosticsDialog } from '@app/components/Custom';
import Typography from '@material-ui/core/Typography';
const DashboardContainer = () => {
  const classes = useStyles();
  const [openCreate, setOpenDialog] = useState(false);
  return (
    <Box className={classes.root}>
      <Typography l="4rem" variant="h4" gutterBottom>
        Dashboard Container
      </Typography>

      <Typography variant="button" display="block" gutterBottom>
        <Button
          l="4rem"
          onClick={() => setOpenDialog(true)}
          color="primary"
          variant="contained"
        >
          View Diagnostics
        </Button>
      </Typography>
      <DiagnosticsDialog
        open={openCreate}
        title="Diagnostics"
        setOpenDialog={setOpenDialog}
      ></DiagnosticsDialog>
    </Box>
  );
};

export default DashboardContainer;
