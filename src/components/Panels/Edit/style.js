import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.primary.contrastText,
    padding: theme.spacing(1)
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
    height: 2,
    marginBottom: theme.spacing(2)
  },
  actionGroup: {
    display: 'flex',
    position: 'absolute',
    right: 0
  },
  actionButton: {
    color: theme.palette.blueGrey['600']
  },
  main: {
    overflowY: 'auto',
    height: 'calc(100vh - 160px) ',
    overflowX: 'hidden'
  },
  sliderMenu: {
    height: 50,
    zIndex: theme.zIndex.drawer + 100,
    marginTop: -53,
    position: 'absolute',
    display: 'flex'
  },
  indicator: {
    backgroundColor: theme.palette.blueGrey['800']
  },
  tab: {
    minWidth: 110,
    paddingTop: theme.spacing(4)
  }
}));

export default useStyles;
