import React, { useState, useEffect } from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';

const CustomCheckBox = ({ value, label, color, onChange }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (value) {
      setChecked(true);
    }
  }, [value]);
  const handleChange = () => {
    setChecked(!checked);
    onChange(checked);
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          color={color}
          checked={checked}
          onChange={handleChange}
          name="antoine"
        />
      }
      label={label}
    />
  );
};

export default CustomCheckBox;
