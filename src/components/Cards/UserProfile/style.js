import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: 26,
    paddingRight: 26
  },
  emailText: {
    fontWeight: 900,
    fontSize: 'inherit',
    color: 'white'
  },
  userNameText: {
    fontWeight: 900,
    color: 'white'
  }
}));

export default useStyles;
