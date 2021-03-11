import React from 'react';
import clsx from 'clsx';
import { Box, Card, LinearProgress } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import useStyles from './style';

const LoadingCard = ({ loading, style, children, isShadow, ...rest }) => {
  const classes = useStyles();

  return (
    <Box component={isShadow ? Card : 'div'} className={classes.root} {...rest}>
      {loading && <LinearProgress className={classes.loading} />}
      <main
        className={clsx({
          [classes.content]: !style,
          [style]: style
        })}
      >
        {loading ? (
          <Skeleton variant="rect" width={'100%'} height={130} />
        ) : (
          children
        )}
      </main>
    </Box>
  );
};

export default LoadingCard;
