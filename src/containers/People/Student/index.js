import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Box, Typography } from '@material-ui/core';
import RouteLeavingGuard from '@app/components/RouteLeavingGuard';
import LoadingSpinner from '@app/components/LoadingSpinner';
import { Edit, Main } from '@app/containers/People/Common';
import useStyles from './style';
import { useSetupUser } from '@app/utils/hooks';

const StudentAdminContainer = ({ history }) => {
  const classes = useStyles();
  const optionType = 'student';

  const [whenState, setWhenState] = useState(false);
  const [isOutSide, setIsOutSide] = useState(false);
  const [isForceSave, setIsForceSave] = useState(false);
  const [forceSaveDocId, setForceSaveDocId] = useState();
  const [editTmpData, setEditTmpData] = useState();

  const [variables, setVariables] = useState({
    id: null,
    collectionName: 'Users',
    type: 'student',
    state: 'active',
    parent: null,
    name: null
  });

  const [
    loadedData,
    setLoadedData,
    selectedData,
    setSelectedData,
    editPanelData,
    setEditPanelData,
    showEdit,
    setShowEdit,
    loading,
    error,
    data
  ] = useSetupUser(variables);

  const handleMainChange = (type, value) => {
    if (type === 'elSingleClick') {
      setEditPanelData(value);
      setShowEdit(true);
      history.push({
        pathname: `/peoples/students/${value['_id']}`
      });
    }
    if (type === 'elDoubleClick') {
      setShowEdit(false);
    }

    if (type === 'delete') {
      setShowEdit(false);
    }
  };

  const checkIsOutSide = (value) => {
    const tmp = value.split('/').length;
    if (tmp > 2) {
      setIsOutSide(true);
    } else {
      setIsOutSide(false);
    }
  };

  const handleGuardChange = (value) => {
    setWhenState(false);
    setShowEdit(true);
    if (isOutSide) {
      setEditPanelData(editTmpData);
      setSelectedData(editTmpData);
      setEditTmpData();
    }

    if (value) {
      setForceSaveDocId(editPanelData['_id']);
      setIsForceSave(true);
    }
  };

  return (
    <Box className={classes.root}>
      <LoadingSpinner loading={loading} />
      <RouteLeavingGuard
        when={whenState}
        navigate={(path) => {
          history.push(path);
        }}
        shouldBlockNavigation={(location) => {
          checkIsOutSide(location.pathname);
          return whenState;
        }}
        onChange={handleGuardChange}
      >
        <Typography variant="subtitle1" className={classes.warning}>
          There are remained some changes on the panel.
          <br />
          Will you discard your current changes?
        </Typography>
      </RouteLeavingGuard>
      <Main
        variables={variables}
        resources={loadedData}
        onChange={handleMainChange}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        setShowEdit={setShowEdit}
        setEditPanelData={setEditPanelData}
        optionType
      />
      {showEdit && (
        <Edit
          forceSaveDocId={forceSaveDocId}
          forceSave={isForceSave}
          setIsForceSave={setIsForceSave}
          setWhenState={setWhenState}
          variables={variables}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          resources={editPanelData}
          setShowEdit={setShowEdit}
          optionType
        />
      )}
    </Box>
  );
};

export default withRouter(StudentAdminContainer);
