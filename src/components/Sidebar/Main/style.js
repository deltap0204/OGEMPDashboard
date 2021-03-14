import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 190;

const useStyles = makeStyles((theme) => ({
  root: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    backgroundColor: theme.palette.blueGrey['800'],
    position: 'relative'
  },
  openAndClose: {
    color: theme.palette.primary.contrastText
  },
  drawerOpen: {
    width: drawerWidth
  },
  drawerClose: {
    overflowX: 'hidden',
    maxWidth: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxHeight: 40.9,
    padding: theme.spacing(0)
  },
  logo: {
    display: 'flex'
  },
  subMenu: {
    marginLeft: '40px'
  },
  separator: {
    background: theme.palette.primary.contrastText,
    height: 2,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2)
  },
  elList: {
    minHeight: `calc(100vh - 250px)`
  },
  listItems: {
    color: theme.palette.primary.contrastText,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(0)
  },
  listItemsSelected: {
    color: theme.palette.blueGrey['300'],
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(0)
  },
  listItemIcons: {
    minWidth: 45
  },
  actionList: {
    width: '100%'
  },
  nested: {
    color: theme.palette.primary.contrastText,
    paddingLeft: theme.spacing(10)
  },
  selectednested: {
    color: theme.palette.blueGrey['300'],
    paddingLeft: theme.spacing(10)
  }
}));

export default useStyles;
