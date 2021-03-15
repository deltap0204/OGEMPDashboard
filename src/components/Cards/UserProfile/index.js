import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  ListItemText,
  Menu,
  MenuItem
} from '@material-ui/core';
import useStyles from './style';
import { Auth } from 'aws-amplify';

const UserProfile = () => {
  const classes = useStyles();
  const theme = useTheme();

  const [user, setUser] = useState();
  const [anchorEl, setAnchorEl] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      return Auth.currentUserInfo({ bypassCache: true });
    };

    const onLoad = async () => {
      try {
        const currentUser = await loadUser();
        console.log(currentUser);
        setUser(currentUser.attributes);
      } catch (err) {
        console.log(err);
      }
    };

    onLoad();
  }, []);

  return (
    <>
      <Grid className={classes.root} onClick={() => setAnchorEl(true)}>
        <ListItemText
          primary={user?.email}
          classes={{ primary: classes.emailText }}
          style={{ marginBottom: '0px' }}
        />
        <Grid container direction="row" alignItems="center">
          <Grid
            xs={3}
            container
            justify="center"
            style={{ padding: 10, background: '#b0bec5', borderRadius: 5 }}
          >
            <FontAwesomeIcon
              icon={faUser}
              size="lg"
              color={theme.palette.primary.contrastText}
            />
          </Grid>
          <Grid style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ paddingLeft: 5, paddingRight: 4 }}>
              <ListItemText
                primary="Username"
                classes={{ primary: classes.userNameText }}
              />
              <ListItemText primary="Super Admin" style={{ color: 'white' }} />
            </Grid>
            <FontAwesomeIcon
              icon={faChevronRight}
              size="lg"
              color={theme.palette.primary.contrastText}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default UserProfile;
