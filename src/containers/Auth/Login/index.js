import { Auth } from 'aws-amplify';
import { useQuery } from '@apollo/client';
import { addMilliseconds } from 'date-fns';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import GoogleLogin from 'react-google-login';
import { Img } from 'react-image';
import { Link, useHistory } from 'react-router-dom';
import {
  Box,
  Grid,
  Button,
  Checkbox,
  TextField,
  Typography,
  CircularProgress,
  FormControlLabel
} from '@material-ui/core';
import { DefaultCard } from '@app/components/Cards';
import { useInput } from '@app/utils/hooks/form';
import config from '@app/Config';
import graphql from '@app/graphql';
import useStyles from './style';

const LoginContainer = () => {
  const cookies = new Cookies();
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const { value: email, bind: bindEmail } = useInput('');
  const { value: password, bind: bindPassword } = useInput('');
  const [loadedUsers, setLoadedUsers] = useState([]);

  const resUsers = useQuery(graphql.queries.user, {
    variables: {
      collectionName: 'Users'
    }
  });
  useEffect(() => {
    if (!resUsers.loading && !resUsers.error) {
      const { user } = resUsers.data;
      setLoadedUsers(user);
    }
  }, [resUsers.loading, resUsers.error, resUsers.data]);

  const setUserInfo = (users, userEmail) => {
    const user = users.find((el) => el.name === userEmail);
    if (!user) {
      window.localStorage.setItem('profile', JSON.stringify({ user: null }));
      // enqueueSnackbar('This user name is not exist!', { variant: 'error' });
      return;
    }
    window.localStorage.setItem('profile', JSON.stringify(user));
    return;
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      if (rememberPassword) {
        cookies.set('email', email, { path: '/' });
        cookies.set('password', password, { path: '/' });
      }

      await Auth.signIn(email, password);
      history.push('/dashboard');
      setLoading(false);
      setUserInfo(loadedUsers, email);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      setLoading(false);
    }
  };

  const handleChechbox = (e) => {
    const isChecked = e.target.type === 'checkbox' && !e.target.checked;
    setRememberPassword(!isChecked);
  };

  const responseGoogle = async (response) => {
    try {
      setLoading(true);
      const user = {
        name: response.profileObj.name,
        email: response.profileObj.email
      };

      await Auth.forgotPassword(user.email);

      let expires_at = addMilliseconds(new Date(), 3600 * 1000).getTime();

      await Auth.federatedSignIn(
        'google',
        { token: response.tokenId, expires_at },
        user
      );

      history.push('/dashboard');
      setLoading(false);
      setUserInfo(loadedUsers, email);
    } catch (error) {
      if (error.message !== `Cannot read property 'name' of undefined`) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
      setLoading(false);
    }
  };

  const handlePageChange = () => {
    window.location.href =
      'https://sig-emp.atlassian.net/servicedesk/customer/portals';
  };

  return (
    <Box className={classes.root}>
      <DefaultCard>
        <Box className={classes.form}>
          <Img src={config.auth.loginUrl} alt="Logo" />
          <Typography className={classes.title} variant="h6">
            Login to your account
          </Typography>
          <TextField
            className={classes.textfield}
            label="Email"
            {...bindEmail}
            type="email"
          />
          <TextField
            className={classes.textfield}
            label="Password"
            type="password"
            {...bindPassword}
          />
          <Grid container display="flex" justify="space-between">
            <FormControlLabel
              label="Remember me"
              control={
                <Checkbox
                  checked={rememberPassword}
                  onChange={(event) => handleChechbox(event)}
                  name="antoine"
                />
              }
            />

            <Link className={classes.link} to="/forgot-password">
              forgot password?
            </Link>
          </Grid>
          <Button
            variant="contained"
            size="large"
            className={classes.loginButton}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading && <CircularProgress size={20} className={classes.mr20} />}
            Login to Your Account
          </Button>
          <GoogleLogin
            className={classes.googleLogin}
            clientId="798060219259-tconre7aslsq0tamq8b9bt0fg9sansq3.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
          <Link
            className={classes.linktextleft}
            rel="noopener"
            target="_blank"
            onClick={handlePageChange}
            target="_blank"
          >
            Trouble Logging in? Contact Support.
          </Link>
        </Box>
        <Box className={classes.poweredby}>
          <Grid item>Powered By &nbsp;</Grid>
          <Grid item>
            <Img
              src={config.auth.loginUrl}
              alt="Bottom Logo"
              className={classes.bottomlogo}
            ></Img>
          </Grid>
        </Box>
      </DefaultCard>
    </Box>
  );
};

export default LoginContainer;
