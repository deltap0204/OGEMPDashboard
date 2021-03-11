import React from 'react';
import { Grid, Box, Typography } from '@material-ui/core';
import { useStateContext } from '@app/providers/StateContext';
import { CustomSelectBox } from '@app/components/Custom';
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

const SchoolForm = ({
  disable,
  document,
  resources,
  onChange,
  size,
  customDefaultValue
}) => {
  const classes = useStyles();
  const [stateContext] = useStateContext();

  const handleChange = (selected) => {
    onChange(selected.value);
  };

  return (
    <Box className={classes.root}>
      {disable ? (
        <Grid container direction="row" alignItems="baseline">
          <Typography gutterBottom variant="subtitle1">
            <b>Schools: </b>
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
            (stateContext.school?.name ? (
              <Typography
                gutterBottom
                variant="subtitle1"
                component="h2"
                style={{ marginLeft: 5 }}
              >
                {stateContext.school.name}
              </Typography>
            ) : (
              <NoneSelected />
            ))}
        </Grid>
      ) : (
        <CustomSelectBox
          id="schools"
          label="Schools"
          variant="outlined"
          value={customDefaultValue || stateContext.school?._id}
          resources={resources}
          style={classes.selectBox}
          onChange={handleChange}
          disabled={disable}
          size={size}
        />
      )}
    </Box>
  );
};

export default SchoolForm;
