import React from 'react';
import { Grid, Box, Typography } from '@material-ui/core';
import { CustomSelectBox } from '@app/components/Custom';
import { useStateContext } from '@app/providers/StateContext';
import useStyles from './style';

const NoneSelected = () => (
  <Typography
    gutterBottom
    variant="subtitle1"
    component="h2"
    style={{ marginLeft: 5 }}
  >
    None Selected *
  </Typography>
);

const StateForm = ({
  disable,
  document,
  resources,
  onChange,
  size,
  customDefaultValue
}) => {
  const classes = useStyles();
  const [stateContext] = useStateContext();

  const handleChange = (data) => {
    onChange(data.value);
  };

  return (
    <Box className={classes.root}>
      {disable ? (
        <Grid container direction="row" alignItems="baseline">
          <Typography gutterBottom variant="subtitle1">
            <b>State: </b>
          </Typography>
          <Typography
            gutterBottom
            variant="subtitle1"
            component="h2"
            style={{ marginLeft: 5 }}
          >
            {customDefaultValue &&
              resources.find((item) => item.value === customDefaultValue)
                ?.label}
          </Typography>
          {!customDefaultValue &&
            (stateContext.state?.name ? (
              <Typography
                gutterBottom
                variant="subtitle1"
                component="h2"
                style={{ marginLeft: 5 }}
              >
                {stateContext.state.name}
              </Typography>
            ) : (
              <NoneSelected />
            ))}
        </Grid>
      ) : (
        <CustomSelectBox
          id="united-states"
          label="State"
          variant="outlined"
          value={customDefaultValue || stateContext.state?._id}
          resources={resources}
          style={classes.selectBox}
          disabled={disable}
          onChange={handleChange}
          size={size}
        />
      )}
    </Box>
  );
};

export default StateForm;
