import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    // padding: theme.spacing(2),
    minHeight: 200
  },
  icon: {
    marginRight: theme.spacing(2)
  },
  separator: {
    height: 2
  },
  content: {
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    minHeight: 'calc(100vh - 310px)',
    // minHeight: 250,
    // maxHeight: 450,
    overflowY: 'auto',
    overflowX: 'hidden',
    background: '#fff'
  },
  contendDroping: {
    // minHeight: 250,
    // maxHeight: 300,
    minHeight: 'calc(100vh - 310px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    filter: 'blur(1px)',
    background: '#fff'
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
  inputArea: {
    width: '100%',
    marginBottom: theme.spacing(1)
  }
}));

export default useStyles;
