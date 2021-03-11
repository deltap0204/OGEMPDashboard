import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    backgroundColor: theme.palette.blueGrey['700'],
    paddingTop: 60
  },
  open: {
    width: drawerWidth
  },
  close: {
    display: 'none'
  },
  textField: {
    padding: `3px ${theme.spacing(1)}px`,
    width: 280,
    background: theme.palette.primary.contrastText
  },
  main: {}
}));

export default useStyles;
