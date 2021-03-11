/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Box, Typography } from '@material-ui/core';
import { CustomSelectBox } from '@app/components/Custom';
import graphql from '@app/graphql';
import { useStateContext } from '@app/providers/StateContext';
import useStyles from './style';

const NoneSelected = () => (
  <Typography
    gutterBottom
    variant="subtitle1"
    component="h2"
    style={{ marginLeft: 5 }}
  >
    Null
  </Typography>
);

const StateForm = ({
  disable,
  document,
  resources,
  onChange,
  size,
  customDefaultValue
}) => {
  const classes = useStyles();
  const [parentId, setParentId] = useState();
  const [loadedData, setLoadedData] = useState('');
  const [stateContext, setStateContext] = useStateContext();

  useEffect(() => {
    if (document) {
      setParentId(document.parent);
      if (
        document.data &&
        document.data.state &&
        document.data.state.length > 0
      ) {
        setLoadedData(document.data.state);
      } else {
        setLoadedData('');
      }
    } else {
      setLoadedData('');
    }
  }, [document]);

  const { loading, error, data } = useQuery(graphql.queries.grouping, {
    variables: {
      id: parentId,
      collectionName: 'Topologies'
    },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (!loading && !error) {
      const { grouping } = data;
      if (document.type === 'school' && parentId) {
        setLoadedData(grouping[0].data?.state);
      }
    }
  }, [loading, error, data]);

  const handleChange = (data) => {
    setLoadedData(data.value);
    onChange(data.value);
  };

  return (
    <Box className={classes.root}>
      {disable ? (
        <Grid
          container
          direction="row"
          alignItems="baseline"
          style={{ padding: 10 }}
        >
          <Typography gutterBottom variant="subtitle1">
            <b>State: </b>
          </Typography>
          <Typography
            gutterBottom
            variant="subtitle1"
            component="h2"
            style={{ marginLeft: 5 }}
          >
            {customDefaultValue &&
              resources.find((item) => item.value === customDefaultValue)
                ?.label}
          </Typography>
          {!customDefaultValue &&
            (stateContext.state?.name ? (
              <Typography
                gutterBottom
                variant="subtitle1"
                component="h2"
                style={{ marginLeft: 5 }}
              >
                {stateContext.state.name}
              </Typography>
            ) : (
              <NoneSelected />
            ))}
        </Grid>
      ) : (
        <CustomSelectBox
          id="united-states"
          label="State"
          variant="outlined"
          value={customDefaultValue || loadedData}
          defaultValue={customDefaultValue || loadedData}
          resources={resources}
          style={classes.selectBox}
          disabled={disable}
          onChange={handleChange}
          size={size}
        />
      )}
    </Box>
  );
};

export default StateForm;
