import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 190;

const useStyles = makeStyles((theme) => ({
  appBar: {
    height: 50,
    zIndex: theme.zIndex.drawer + 1,
    width: `calc(100% - ${theme.spacing(7) + 1}px)`
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`
  },
  hide: {
    display: 'none'
  },
  menuButton: {
    marginRight: 36
  },
  toolBar: {
    minHeight: 50,
    display: 'flex',
    justifyContent: 'space-between'
  },
  items: {
    cursor: 'pointer'
  }
}));

export default useStyles;
