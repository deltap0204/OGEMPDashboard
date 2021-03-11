/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Box } from '@material-ui/core';
import { CustomSelectBox } from '@app/components/Custom';
import graphql from '@app/graphql';
import useStyles from './style';

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
    </Box>
  );
};

export default StateForm;
