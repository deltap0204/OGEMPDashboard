/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Box } from '@material-ui/core';
import { CustomSelectBox } from '@app/components/Custom';
import graphql from '@app/graphql';
import useStyles from './style';

const StationForm = ({
  disable,
  document,
  onChange,
  size,
  customDefaultValue
}) => {
  const classes = useStyles();
  const [selectBoxData, setSelectBoxData] = useState([]);
  const [stations, setStations] = useState([]);
  const [parentId, setParentId] = useState();
  const [loadedData, setLoadedData] = useState('');

  const { loading, error, data } = useQuery(graphql.queries.grouping, {
    variables: {
      collectionName: 'Topologies',
      type: 'station'
    },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (!loading && !error) {
      const { grouping } = data;
      const tmp = grouping.map((el) => ({ label: el.name, value: el['_id'] }));
      setSelectBoxData(tmp);
      setStations(grouping);
    }
  }, [loading, error, data]);

  useEffect(() => {
    setParentId();
    if (document) {
      if (document.type === 'district') {
        if (document.data && document.data.station) {
          setLoadedData(document.data.station);
        } else {
          setLoadedData('');
        }
      }

      if (document.type === 'school') {
        setParentId(document.parent);
      }
    } else {
      setLoadedData('');
    }
  }, [document]);

  const resGetDistrict = useQuery(graphql.queries.grouping, {
    variables: {
      id: parentId,
      collectionName: 'Topologies',
      type: 'district'
    }
  });

  useEffect(() => {
    if (!resGetDistrict.loading && !resGetDistrict.error) {
      if (parentId) {
        const { grouping } = resGetDistrict.data;
        if (grouping[0].data && grouping[0].data.station) {
          setLoadedData(grouping[0].data.station);
        } else {
          setLoadedData('');
        }
      }
    }
  }, [resGetDistrict.loading, resGetDistrict.error, resGetDistrict.data]);

  const handleChange = (data) => {
    onChange(data.value);
    const tmp = stations.filter((el) => el['_id'] === data.value);
    if (tmp.length > 0) {
      setLoadedData(tmp[0]['_id']);
    } else {
      setLoadedData();
    }
  };

  return (
    <Box className={classes.root}>
      <CustomSelectBox
        id="united-states"
        label="Station"
        variant="outlined"
        style={classes.selectBox}
        value={customDefaultValue || loadedData}
        defaultValue={customDefaultValue || loadedData}
        resources={selectBoxData}
        disabled={disable}
        onChange={handleChange}
        size={size}
      />
    </Box>
  );
};

export default StationForm;
