import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  mainRoot: {
    flex: 1,
    padding: 0
  },
  label: {
    fontWeight: 'inherit',
    color: 'inherit'
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 0)
  },
  labelIcon: {
    marginRight: theme.spacing(2)
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
    fontSize: 13
  },
  state: {
    fontSize: 12,
    fontWeight: 600,
    padding: '2px 13px',
    borderRadius: 15,
    margin: 0,
    backgroundColor: '#21ff00'
  }
}));

export default useStyles;
