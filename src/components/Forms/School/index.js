import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import { CustomSelectBox } from '@app/components/Custom';
import useStyles from './style';

const SchoolForm = ({
  disable,
  document,
  resources,
  onChange,
  size,
  customDefaultValue
}) => {
  const classes = useStyles();
  const [loadedData, setLoadedData] = useState('');

  const handleChange = (selected) => {
    onChange(selected.value);
    setLoadedData(selected.value);
  };

  return (
    <Box className={classes.root}>
      <CustomSelectBox
        id="schools"
        label="Schools"
        variant="outlined"
        value={customDefaultValue || loadedData}
        defaultValue={customDefaultValue || loadedData}
        resources={resources}
        style={classes.selectBox}
        onChange={handleChange}
        disabled={disable}
        size={size}
      />
    </Box>
  );
};

export default SchoolForm;
