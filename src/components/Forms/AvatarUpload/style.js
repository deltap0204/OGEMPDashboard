import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    marginBottom: theme.spacing(2)
  },
  shadowRoot: {
    flex: 1,
    boxShadow:
      '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'
  },
  dropzoneCard: {
    background: theme.palette.blueGrey['50']
  },
  dropzone: {
    width: '100%',
    minHeight: theme.spacing(10),
    // background: theme.palette.blueGrey['50'],
    outline: 'none',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dropzoneParagraph: {
    fontSize: 11,
    color: theme.palette.blueGrey['700']
  },
  imageArea: {
    position: 'relative',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    minHeight: theme.spacing(10),
    background: '#fff'
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: -5
  },
  media: {
    height: theme.spacing(10),
    backgroundSize: 'contain'
  },
  preview: {
    paddingBottom: theme.spacing(2),
    // display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
    // position: 'relative'
  },
  preview1: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  }
}));

export default useStyles;
