import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Box } from '@material-ui/core';
import LoadingSpinner from '@app/components/LoadingSpinner';
import { Edit, Main } from '@app/containers/People/Common';
import useStyles from './style';
import { useFetchData } from '@app/utils/hooks';
import { CustomSelectBox } from '@app/components/Custom';

const School = ({ resources, parent, setParent, setWhenState }) => {
  const classes = useStyles();
  const [variables, setVariables] = useState({
    id: null,
    collectionName: 'Schools',
    type: 'school'
  });

  const [loadedData] = useFetchData(variables);

  var temp_schools = [];
  loadedData?.map((item, index) => {
    temp_schools.push({ label: item.name, value: item._id });
  });

  const handleSelected = (selected) => {
    setParent(selected.value);
    setWhenState('update', true);
  };

  return (
    <>
      <CustomSelectBox
        id="us-school"
        style={classes.selectBox}
        label="school"
        variant="outlined"
        value={parent}
        defaultValue={parent}
        resources={temp_schools}
        onChange={handleSelected}
      />
      {!parent ? '*School field is mandatory' : ''}
    </>
  );
};

export default School;
