import React, { useState } from 'react';
import clsx from 'clsx';
import { Box, TextField } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import useStyles from './style';

const SecondarySidebar = (props) => {
  const classes = useStyles();
  const [filterKey, setFilterKey] = useState('');

  const handleFilterKeyChange = (event) => {
    if (event.charCode === 13) {
      setFilterKey('');
    }
  };

  return (
    <Box
      className={clsx(classes.root, {
        [classes.open]: props.open,
        [classes.close]: !props.open
      })}
      textAlign="center"
    >
      <TextField
        value={filterKey}
        className={classes.textField}
        onChange={(e) => setFilterKey(e.target.value)}
        onKeyPress={handleFilterKeyChange}
        InputProps={{
          startAdornment: (
            <FontAwesomeIcon icon={faSearch} style={{ marginRight: 10 }} />
          )
        }}
      />

      <main className={classes.main}>{props.children}</main>
    </Box>
  );
};

export default SecondarySidebar;
