import { makeStyles } from '@material-ui/core/styles';
import theme from '@app/styles/theme';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    // padding: theme.spacing(1),

    backgroundColor: theme.palette.blueGrey['50'],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: theme.spacing(10)
  }
}));

const colourStyles = {
  container: (styles) => ({
    ...styles,
    width: '100%'
  }),
  control: (styles) => ({
    ...styles,
    backgroundColor: 'white',
    border: 'none'
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,

      backgroundColor: isDisabled
        ? null
        : isSelected
        ? theme.palette.blueGrey['900']
        : isFocused
        ? theme.palette.lightGrey['40']
        : null,
      color: isDisabled
        ? '#fff'
        : isSelected
        ? theme.palette.lightGrey['50']
          ? 'white'
          : theme.palette.lightGrey['20']
        : theme.palette.blueGrey['900'],
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor:
          !isDisabled &&
          (isSelected
            ? theme.palette.lightGrey['50']
            : theme.palette.lightGrey['20'])
      }
    };
  },
  multiValue: (styles) => {
    return {
      ...styles,
      backgroundColor: theme.palette.lightGrey['20'],
      border: 'none',
      borderRadius: '25px',
      fontSize: '14px'
    };
  },
  multiValueLabel: (styles) => ({
    ...styles,
    color: theme.palette.blueGrey['900']
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: theme.palette.blueGrey['900'],
    ':hover': {
      backgroundColor: theme.palette.blueGrey['900'],
      color: 'white'
    }
  })
};

export { colourStyles };

export default useStyles;
