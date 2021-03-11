import React, { useState, useEffect } from 'react';
import { Box } from '@material-ui/core';
import useStyles from './style';
import theme from '@app/styles/theme';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { colourStyles } from './style';
const animatedComponents = makeAnimated();
const MultiTagsForm = ({ disable }) => {
  const classes = useStyles();

  const [option, setOption] = useState([]);
  const [selectedValue, setSelectedValue] = useState();

  const onSelect = (selectedList, selectedItem) => {
    console.log('select');
  };

  const onRemove = (selectedList, removedItem) => {
    console.log('remove');
  };

  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      let item = {
        value: selectedValue,
        label: selectedValue
      };
      setOption([...option, item]);
    }
  };

  return (
    <Box className={classes.root}>
      <fieldset
        style={{ border: `1px solid ${theme.palette.blueGrey['300']}` }}
      >
        <legend>Tags</legend>
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          defaultValue={selectedValue}
          isMulti
          options={option}
          styles={colourStyles}
          id="demo-simple-select-label"
          isDisabled={disable}
          onInputChange={handleChange}
          onKeyDown={onKeyDown}
        />
      </fieldset>
    </Box>
  );
};

export default MultiTagsForm;
