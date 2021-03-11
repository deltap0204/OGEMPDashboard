import React from 'react';
import clsx from 'clsx';
import { Box, TextField } from '@material-ui/core';
import useStyles from './style';

const CustomInput = ({
  label,
  type,
  style,
  resources,
  error,
  helperText,
  onChange,
  ...rest
}) => {
  const classes = useStyles();
  const handleChange = (e) => {
    if (label === 'SMS') {
      if (!isNaN(e.target.value)) onChange(e.target.value);
    } else {
      onChange(e.target.value);
    }
  };
  return (
    <Box
      className={clsx(classes.root, {
        [style]: style
      })}
      component={TextField}
      value={resources}
      type={type}
      label={label}
      onChange={handleChange}
      {...rest}
      error={error}
      helperText={helperText}
      InputProps={{
        style: { fontSize: 11 }
      }}
      InputLabelProps={{ style: { fontSize: 11 } }}
    />
  );
};

export default CustomInput;
