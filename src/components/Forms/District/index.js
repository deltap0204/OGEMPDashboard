import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import { CustomSelectBox } from '@app/components/Custom';
import useStyles from './style';

const DistrictForm = ({
  disable,
  document,
  resources,
  onChange,
  size,
  customDefaultValue
}) => {
  const classes = useStyles();
  const [loadedData, setLoadedData] = useState(() => customDefaultValue || '');
  const [isDisabled, setIsDisabled] = useState(false);

  const handleChange = (selected) => {
    onChange(selected.value);
    setLoadedData(selected.value);
  };

  return (
    <Box className={classes.root}>
      <CustomSelectBox
        id="istricts"
        label="Districts"
        variant="outlined"
        value={customDefaultValue || loadedData}
        defaultValue={customDefaultValue || loadedData}
        resources={resources}
        style={classes.selectBox}
        disabled={disable}
        onChange={handleChange}
        size={size}
      />
    </Box>
  );
};

export default DistrictForm;
