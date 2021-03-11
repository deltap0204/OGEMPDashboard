import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  docId: {
    color: theme.palette.blueGrey['700'],
    marginBottom: theme.spacing(1)
  },
  button: {
    width: '100%',
    backgroundColor: theme.palette.blueGrey['700'],
    color: theme.palette.blueGrey['100'],
    marginTop: '20px',
    '&:hover': {
      backgroundColor: theme.palette.blueGrey['600'],
      color: theme.palette.blueGrey['100']
    }
  },
  listItems: {
    cursor: 'pointer',
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0)
  },
  listItem: {
    color: theme.palette.blueGrey['900'],
    fontWeight: 700
  },
  listItemSelected: {
    color: theme.palette.common.black,
    fontWeight: 700,
    background: theme.palette.blueGrey['200']
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
  formHead: {
    marginTop: '10px'
  },
  selectBox: {
    marginTop: theme.spacing(1),
    maxHeight: 25,
    background: theme.palette.common.white
  },
  toolbar: {
    fontSize: 16,
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}));

export default useStyles;
