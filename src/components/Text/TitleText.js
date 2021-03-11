import { Typography, Paper } from '@material-ui/core';

const TitleText = ({ heading, value, customStyle }) => {
  return (
    <Paper style={{ padding: '2px 10px', ...customStyle }}>
      <Typography variant="body2" color="textSecondary" component="p">
        {heading}
      </Typography>
      <Typography gutterBottom variant="h3" component="h2" style={{ fontSize: '1.303rem', ...customStyle }}>
        {value ? value : `Null`}
      </Typography>
    </Paper>
  );
};

export default TitleText;
