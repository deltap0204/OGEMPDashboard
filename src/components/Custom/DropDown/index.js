import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Box, Menu, MenuItem } from '@material-ui/core';
import useStyles from './style';

const CustomDropDown = ({ resources, onChange }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickElement = (event, value) => {
    event.preventDefault();
    onChange(value);
    setAnchorEl(null);
  };

  return (
    <Box className={classes.root}>
      <FontAwesomeIcon
        icon={faChevronDown}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {resources.map((el, index) => (
          <MenuItem
            key={index}
            onClick={(e) => handleClickElement(e, el.value)}
          >
            {el.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default CustomDropDown;
