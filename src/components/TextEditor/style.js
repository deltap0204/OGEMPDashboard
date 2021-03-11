import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    padding: 0
  },
  wrapperArea: {
    border: `1px solid ${theme.palette.blueGrey['50']}`,
    minHeight: 'calc(100vh - 200px);'
  },
  toolbarArea: {
    border: 'none',
    borderBottom: `1px solid ${theme.palette.blueGrey['50']}`,
    boxSizing: 'border-box',
    padding: '6px, 0, 0, 0'
  },
  hiddentoolbarArea: {
    display: 'none'
  },
  editorArea: {
    padding: `0 ${theme.spacing(2)}px`
  },
  blockType: {
    fontSize: 8
  }
}));

export default useStyles;
