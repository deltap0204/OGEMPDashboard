import React, { useState } from 'react';
import { Box, Divider, Typography } from '@material-ui/core';
import { useStateContext } from '@app/providers/StateContext';
import IconButton from '@material-ui/core/IconButton';
import useStyles from './style';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import versionData from '@app/version.json';
import Slider from '../../Custom/Diagnostics/slider';

const GlobalStatus = ({ width }) => {
  const classes = useStyles();
  const [stateContext] = useStateContext();
  const [slider, setSlider] = useState(false);

  function sliderClicked() {
    setSlider(!slider);
  }
  return (
    <Box className={classes.root}>
      <Divider />
      {slider && (
        <Slider
          slider={slider}
          sliderClicked={sliderClicked}
          stateContext={stateContext}
        />
      )}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pl={3}
        pr={3}
        height={40}
      >
        <p className={classes.p}>
          <IconButton aria-label="info" onClick={sliderClicked}>
            <InfoOutlinedIcon fontSize="medium" />
          </IconButton>
        </p>
      </Box>
    </Box>
  );
};

export default GlobalStatus;
