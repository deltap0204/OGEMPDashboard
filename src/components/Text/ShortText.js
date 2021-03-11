import { Typography, Paper } from '@material-ui/core';

const ShortText = ({ heading, value, customStyle }) => {
  return (
    <Paper style={{ padding: 10, marginTop: 10, ...customStyle }}>
      <Typography variant="body2" component="p" color="textSecondary">
        {heading}
      </Typography>
      <Typography variant="h5" component="h2">
        {value ? value : `Null`}
      </Typography>
    </Paper>
  );
};

export default ShortText;
