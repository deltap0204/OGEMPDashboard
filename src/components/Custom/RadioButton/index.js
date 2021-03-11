import React, { useState, useEffect } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import useStyles from './style';

const CustomRadioButtonsGroup = ({ setSubType, selectedTreeItem }) => {
  const classes = useStyles();
  const [value, setValue] = useState('document');

  useEffect(() => {
    if (selectedTreeItem[0]?.subType == 'document') {
      setValue('folder');
    }
  });

  const handleChange = (event) => {
    setValue(event.target.value);
    setSubType(event.target.value);
  };

  return (
    <FormControl className={classes.root}>
      <FormLabel component="legend">Material Type</FormLabel>
      <RadioGroup
        row
        aria-label="materialtype"
        name="materialtype"
        className={classes.fullWidth}
        value={value}
        onChange={handleChange}
      >
        {selectedTreeItem[0]?.subType == 'document' ? (
          <FormControlLabel
            value="document"
            control={<Radio />}
            label="Document"
            disabled
          />
        ) : (
          <FormControlLabel
            value="document"
            control={<Radio />}
            label="Document"
          />
        )}
        <FormControlLabel value="folder" control={<Radio />} label="Folder" />
      </RadioGroup>
    </FormControl>
  );
};

export default CustomRadioButtonsGroup;
