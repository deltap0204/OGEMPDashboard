import { Typography, Paper } from '@material-ui/core';

const LongText = ({ heading, value, customStyle }) => {
  return (
    <Paper style={{ padding: 10, marginTop: 10, ...customStyle }}>
      <Typography variant="body2" color="textSecondary" component="p">
        {heading}
      </Typography>
      <Typography
        variant="body1"
        component="p"
        style={{ marginTop: 5, maxWidth: 500 }}
      >
        {value ? value : `Null`}
      </Typography>
    </Paper>
  );
};

export default LongText;
