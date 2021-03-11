import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.blueGrey['50']
  },
  btnAdd: {
    width: '100%',
    backgroundColor: theme.palette.blueGrey['800'],
    color: theme.palette.background.paper
  },
  contactInfo: {
    flex: 1,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.blueGrey['200'],
    marginBottom: theme.spacing(2)
  },
  contactSummary: {
    padding: theme.spacing(1),
    '& > *': {
      marginTop: theme.spacing(0),
      marginBottom: theme.spacing(0)
    }
  },
  textArea: {
    minWidth: '100%',
    maxWidth: '100%',
    marginTop: theme.spacing(0),
    fontFamily: 'Roboto',
    fontSize: 16,
    paddingTop: 9,
    paddingLeft: 12,
    outlineColor: theme.palette.primary.main,
    borderRadius: 5,
    borderColor: '#c1bdbd'
  },
  inputArea: {
    width: '100%',
    marginTop: 3,
    marginBottom: 3,
    borderRadius: 5,
    backgroundColor: theme.palette.background.paper
  },
  selectBox: {
    marginTop: 3,
    backgroundColor: theme.palette.background.paper
  },
  docName: {
    paddingTop: theme.spacing(2),
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center'
  }
}));

export default useStyles;
