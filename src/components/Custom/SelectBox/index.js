import React, { useState } from 'react';
import clsx from 'clsx';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText
} from '@material-ui/core';
import useStyles from './styles';

const CustomSelectBox = ({
  id,
  label,
  variant,
  style,
  customStyle,
  defaultValue,
  helperText,
  resources,
  error,
  onChange,
  size,
  ...rest
}) => {
  const classes = useStyles();

  const handleChange = (event) => {
    const selData = resources.find((el) => el.value === event.target.value);
    onChange(selData);
  };

  return (
    <FormControl
      variant={variant}
      className={clsx(classes.root, {
        [classes.fullWidth]: style
      })}
      size={size}
      error={error}
    >
      <InputLabel id={`label-${id}`} className={classes.label}>
        {label}
      </InputLabel>
      <Select
        id={id}
        labelId={`label-${id}`}
        className={style}
        onChange={handleChange}
        style={customStyle}
        error={error}
        {...rest}
      >
        {resources.map((el, index) => (
          <MenuItem key={index} value={el.value}>
            {el.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelectBox;
