import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  IconButton
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { HideOnScroll } from '@app/components/ScrollButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import useStyles from './style';
import { Auth } from 'aws-amplify';

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func
};

const Navbar = ({ layout, open, onElClick }) => {
  const classes = useStyles();
  const history = useHistory();
  const [position, setPosition] = useState('relative');
  const [isDashboard, setIsDashboard] = useState(false);
  const [isAuthenticated, setLoggedIn] = useState(true);

  useEffect(() => {
    (async () => {
      let user = null;
      try {
        user = await Auth.currentAuthenticatedUser();
        if (user) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (e) {
        setLoggedIn(false);
      }
    })();
  });

  useEffect(() => {
    if (layout === 'dashboard') {
      setPosition('fixed');
      setIsDashboard(true);
    }
  }, [layout]);

  const handleClick = () => {
    history.push('/dashboard');
  };

  const handleIconClicked = (type) => {
    onElClick(type);
  };

  return (
    <HideOnScroll>
      <AppBar
        position={position}
        color="inherit"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}
        style={isDashboard || { width: '100%' }}
      >
        <Toolbar id="back-to-top-anchor" className={classes.toolBar}>
          <Typography variant="h6" component="h6" onClick={handleClick} noWrap>
            {isDashboard ? '' : 'LOGO'}
          </Typography>

          {isAuthenticated && !isDashboard ? (
            <IconButton>
              <AccountCircle />
            </IconButton>
          ) : (
            !isDashboard && (
              <Button
                color="primary"
                onClick={() => {
                  history.push({ pathname: '/' });
                }}
              >
                Sign In
              </Button>
            )
          )}

          {isDashboard && (
            <FontAwesomeIcon
              icon={faSearch}
              onClick={() => handleIconClicked('search')}
              className={classes.items}
            />
          )}
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
