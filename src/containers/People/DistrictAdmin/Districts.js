import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Box } from '@material-ui/core';
import LoadingSpinner from '@app/components/LoadingSpinner';
import { Edit, Main } from '@app/containers/People/Common';
import useStyles from './style';
import { useFetchData } from '@app/utils/hooks';
import { CustomSelectBox } from '@app/components/Custom';

const District = ({ resources, parent, setParent, setWhenState }) => {
  const classes = useStyles();
  const [variables, setVariables] = useState({
    id: null,
    collectionName: 'Schools',
    type: 'district'
  });

  const [loadedData] = useFetchData(variables);
  var temp_districts = [];
  loadedData?.map((item, index) => {
    temp_districts.push({ label: item.name, value: item._id });
  });

  const handleSelected = (selected) => {
    setParent(selected.value);
    setWhenState('update', true);
  };

  return (
    <>
      <CustomSelectBox
        id="us-district"
        style={classes.selectBox}
        label="district"
        variant="outlined"
        value={parent}
        resources={temp_districts}
        onChange={handleSelected}
      />
      {!parent ? '*District field is mandatory' : ''}
    </>
  );
};

export default District;
