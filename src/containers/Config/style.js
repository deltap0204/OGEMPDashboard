import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  listItems: {
    cursor: 'pointer',
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0)
  },
  listItem: {
    color: theme.palette.blueGrey['900'],
    fontWeight: 700,
    paddingTop: 3,
    paddingBottom: 3
  },
  listItemSelected: {
    color: theme.palette.common.black,
    fontWeight: 700,
    background: theme.palette.blueGrey['200'],
    paddingTop: 3,
    paddingBottom: 3
  },
  listItemText: {
    color: theme.palette.blueGrey['700']
  },
  listSelectedItemText: {
    fontWeight: 700,
    color: theme.palette.blueGrey['700']
  },
  docId: {
    color: theme.palette.blueGrey['700'],
    marginBottom: theme.spacing(1)
  },
  warning: {
    color: theme.palette.blueGrey['800'],
    fontWeight: 500,
    fontSize: 18
  },
  boxBtn: {
    borderRadius: 3,
    width: '100%',
    backgroundColor: theme.palette.blueGrey['50'],
    height: '100px',
    lineHeight: '100px',
    fontSize: '1rem',
    marginBottom: theme.spacing(2),
    boxShadow:
      '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'
  }
}));

export default useStyles;
