import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.blueGrey['50']
  },
  inputArea: {
    width: '100%',
    marginTop: 3,
    marginBottom: 3,
    borderRadius: 5,
    backgroundColor: theme.palette.background.paper
  },
  textArea: {
    minWidth: '100%',
    maxWidth: '100%',
    marginTop: theme.spacing(1),
    fontFamily: 'Roboto',
    fontSize: 16,
    paddingTop: 9,
    paddingLeft: 12,
    outlineColor: theme.palette.primary.main,
    borderRadius: 5,
    borderColor: '#c1bdbd'
  },
  boxBtn: {
    borderRadius: 3
  },
  btnAdd: {
    width: '100%',
    backgroundColor: theme.palette.blueGrey['800'],
    color: theme.palette.background.paper
  },
  selectBox: {
    marginTop: 3,
    backgroundColor: theme.palette.background.paper
  },
  contactCard: {
    display: 'flex',
    flex: 1,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.blueGrey['200'],
    marginBottom: theme.spacing(0)
  },
  docName: {
    paddingTop: theme.spacing(2),
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center'
  },
  closeIcon: {
    marginLeft: '-10px',
    top: '-25px',
    left: '10px'
  },
  iconBtns: {
    float: 'right'
  },
  iconBtn: {
    padding: 0,
    marginLeft: theme.spacing(1)
  },
  docId: {
    float: 'left'
  }
}));

export default useStyles;
