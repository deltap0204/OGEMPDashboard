import React from 'react';
import { DefaultCard } from '@app/components/Cards';
import useStyles from './style';

const LocationForm = () => {
  const classes = useStyles();
  return <DefaultCard className={classes.root}>LocationForm</DefaultCard>;
};

export default LocationForm;
