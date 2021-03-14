import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    position: 'sticky',
    padding: `0 ${theme.spacing(2)}px`
  },
  p: {
    margin: theme.spacing(1),
    fontSize: 13,
    color: theme.palette.blueGrey['600'],
    fontWeight: 500,
    marginLeft: '78vw'
  }
}));

export default useStyles;
