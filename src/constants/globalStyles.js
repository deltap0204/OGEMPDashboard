import { makeStyles } from '@material-ui/core/styles';
// import theme from '@app/styles/theme';

export const GridSpacingStyles = {
  editPanelSpacing: 0
};

export const globaluseStyles = makeStyles((theme) => ({
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
  descCard: {
    width: '100%',
    background: theme.palette.blueGrey['50'],
    marginBottom: theme.spacing(2)
  },
  state: {
    fontSize: 12,
    fontWeight: 600,
    padding: '2px 13px',
    borderRadius: 15,
    margin: 0,
    backgroundColor: '#21ff00'
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
  },
  detailCard: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.blueGrey['50']
  },
  formHead: {
    marginTop: '10px'
  },
  selectBox: {
    marginTop: theme.spacing(1),
    maxHeight: 40,
    background: theme.palette.common.white
  },
  toolbar: {
    fontSize: 16,
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  media: {
    height: 72,
    backgroundSize: 'contain'
  },
  editPanelHtmlCard: {
    minHeight: 'calc(100vh - 370px);',
    backgroundColor: theme.palette.blueGrey['50']
  },
  editPanelHtmlCard1: {
    minHeight: 'calc(100vh - 453px);',
    backgroundColor: theme.palette.blueGrey['50']
  },
  editPanelTagCard: {
    minHeight: theme.spacing(12),
    backgroundColor: theme.palette.blueGrey['50']
  },
  editPanelAttachCard: {
    marginTop: theme.spacing(2),
    minHeight: 'calc(100vh - 259px)',
    backgroundColor: theme.palette.blueGrey['50']
  }
}));

export const DescCardStyle = makeStyles((theme) => ({
  root: {
    flex: 1,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.blueGrey['50']
  },
  inputArea: {
    width: '100%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    // fontSize: 10,
    fontWeight: 100
  },
  textArea: {
    minWidth: '100%',
    maxWidth: '100%',
    marginTop: theme.spacing(1),
    fontFamily: 'Roboto',
    // fontSize: 10,
    fontWeight: 100,
    paddingTop: 9,
    paddingLeft: 12,
    outlineColor: theme.palette.primary.main,
    borderRadius: 5,
    borderColor: '#c1bdbd'
  }
}));
