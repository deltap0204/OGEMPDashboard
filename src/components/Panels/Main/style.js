import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'block',
    width: 300,
    background: theme.palette.blueGrey['50'],
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1)
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 700,
    position: 'relative',
    color: theme.palette.blueGrey['500']
  },
  separator: {
    background: theme.palette.blueGrey['500'],
    height: 2
  },
  menu: {
    position: 'absolute',
    right: 0
  },
  main: {
    overflowY: 'auto',
    height: 'calc(100vh - 130px) ',
    overflowX: 'hidden'
  }
}));

export default useStyles;
