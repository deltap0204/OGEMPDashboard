/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Typography } from '@material-ui/core';
import LoadingSpinner from '@app/components/LoadingSpinner';
import RouteLeavingGuard from '@app/components/RouteLeavingGuard';
import graphql from '@app/graphql';
import AppContext from '@app/AppContext';
import { useStateContext } from '@app/providers/StateContext';
import MaterialMain from './Main';
import MaterialEdit from './Edit';
import useStyles from './style';

const MaterialContainer = ({ history, match }) => {
  const classes = useStyles();
  const [showEdit, setShowEdit] = useState(false);
  const [whenState, setWhenState] = useState(false);
  const [isOutSide, setIsOutSide] = useState(false);
  const [loadedData, setLoadedData] = useState([]);
  const [stateLoadedData, setStateLoadedData] = useState([]);
  const [stationLoadedData, setStationLoadedData] = useState([]);
  const [schoolLoadedData, setSchoolLoadedData] = useState([]);
  const [districtLoadedData, setDistrictLoadedData] = useState([]);
  const [classLoadedData, setClassLoadedData] = useState([]);
  const [editPanelData, setEditPanelData] = useState();
  const [editTmpData, setEditTmpData] = useState();
  const [selectedDocId, setSelectedDocId] = useState();
  const [isForceSave, setIsForceSave] = useState(false);
  const [context, setContext] = useContext(AppContext);
  const [forceSaveDocId, setForceSaveDocId] = useState();
  const [forceSaveDocVersion, setForceSaveDocVersion] = useState(1);
  const [stateContext, setStateContext] = useStateContext();
  const [isFirst, setIsFirst] = useState(0);
  const [selectedTreeItem, setSelectedTreeItem] = useState();

  const [createGrouping] = useMutation(graphql.mutations.createGrouping);

  const [updateGroupingRename] = useMutation(
    graphql.mutations.updateGroupingRename
  );

  const variables = {
    id: null,
    collectionName: 'Classes',
    type: 'material',
    // parent: null,
    nam: null
  };

  const stateVariables = {
    id: null,
    collectionName: 'Topologies',
    type: 'state',
    parent: null,
    nam: null
  };

  const stationVariables = {
    id: null,
    collectionName: 'Topologies',
    type: 'station',
    parent: null,
    nam: null
  };

  const districtVariables = {
    id: null,
    collectionName: 'Topologies',
    type: 'district',
    parent: null,
    nam: null
  };

  const schoolVariables = {
    id: null,
    collectionName: 'Topologies',
    type: 'school',
    parent: null,
    nam: null
  };

  const classVariables = {
    id: null,
    collectionName: 'Topologies',
    type: 'class',
    nam: null
  };

  const { loading, error, data } = useQuery(graphql.queries.grouping, {
    variables,
    fetchPolicy: 'network-only'
  });

  const {
    loading: stateLoading,
    error: stateError,
    data: stateData
  } = useQuery(graphql.queries.grouping, {
    variables: stateVariables,
    fetchPolicy: 'network-only'
  });

  const {
    loading: stationLoading,
    error: stationError,
    data: stationData
  } = useQuery(graphql.queries.grouping, {
    variables: stationVariables,
    fetchPolicy: 'network-only'
  });

  const {
    loading: districtLoading,
    error: districtError,
    data: districtData
  } = useQuery(graphql.queries.grouping, {
    variables: districtVariables,
    fetchPolicy: 'network-only'
  });

  const {
    loading: schoolLoading,
    error: schoolError,
    data: schoolData
  } = useQuery(graphql.queries.grouping, {
    variables: schoolVariables,
    fetchPolicy: 'network-only'
  });

  const {
    loading: classLoading,
    error: classError,
    data: classData
  } = useQuery(graphql.queries.grouping, {
    variables: classVariables,
    fetchPolicy: 'network-only'
  });

  const [updateGroupingDocState] = useMutation(
    graphql.mutations.updateGroupingDocState
  );

  useEffect(() => {
    if (stateContext.material) {
      setShowEdit(true);
      setSelectedDocId(stateContext.material['_id']);
      setEditPanelData(stateContext.material);
    }
  }, []);

  useEffect(() => {
    if (selectedTreeItem && selectedTreeItem[0]._id == 'root') {
      setShowEdit(false);
    }
  }, [selectedTreeItem]);

  useEffect(() => {
    if (!stationLoading && !stationError) {
      const { grouping } = stationData;
      const stationList = [];
      grouping.map((item) =>
        stationList.push({ label: item['name'], value: item['_id'] })
      );
      setStationLoadedData(stationList);
    }
  }, [stationLoading, stationError, stationData]);

  useEffect(() => {
    if (!stateLoading && !stateError) {
      const { grouping } = stateData;
      const stateList = [];
      grouping.map((item) =>
        stateList.push({ label: item['name'], value: item['_id'] })
      );
      setStateLoadedData(stateList);
    }
  }, [stateLoading, stateError, stateData]);

  useEffect(() => {
    if (!schoolLoading && !schoolError) {
      const { grouping } = schoolData;
      const schoolList = [];
      grouping.map((item) =>
        schoolList.push({ label: item['name'], value: item['_id'] })
      );
      setSchoolLoadedData(schoolList);
    }
    if (loadedData.length > 0) {
      loadedData.map(
        async (el) =>
          await updateGroupingDocState({
            variables: {
              id: el['_id'],
              collectionName: 'Topologies',
              version: el['docState'].version,
              state: null
            }
          })
      );
    }
  }, [schoolLoading, schoolError, schoolData]);

  useEffect(() => {
    if (!districtLoading && !districtError) {
      const { grouping } = districtData;
      const districtList = [];
      grouping.map((item) =>
        districtList.push({ label: item['name'], value: item['_id'] })
      );
      setDistrictLoadedData(districtList);
    }
  }, [districtLoading, districtError, districtData]);

  useEffect(() => {
    if (!classLoading && !classError) {
      const { grouping } = classData;
      const classList = [];
      grouping.map((item) =>
        classList.push({ label: item['name'], value: item['_id'] })
      );
      setClassLoadedData(classList);
    }
  }, [classLoading, classError, classData]);

  useEffect(() => {
    if (!loading && !error) {
      const { grouping } = data;
      setLoadedData(grouping);
      // setShowEdit(false);
      // if (!stateContext.material && grouping.length > 0) {
      //   setShowEdit(true);
      //   setSelectedDocId(grouping[0]['_id']);
      //   setEditPanelData(grouping[0]);
      // }
      if (!selectedTreeItem) {
        setShowEdit(false);
      }
      setIsFirst(isFirst + 1);
    }
  }, [loading, error, data]);

  useEffect(() => {
    if (context) {
      if (context.groupingAdd) {
        const { collectionName, type } = context.groupingAdd;
        if (collectionName === 'Classes' && type === 'material') {
          setLoadedData([...loadedData, context.groupingAdd]);
          setContext({
            ...context,
            groupingAdd: null
          });
        }
      }
      if (context.documentDelete) {
        const { _id, collectionName } = context.documentDelete;
        if (collectionName === 'Classes') {
          if (editPanelData && _id === editPanelData['_id']) setShowEdit(false);
          const tmp = loadedData.filter((el) => el['_id'] !== _id);
          setLoadedData(tmp);
          if (tmp.length === 0) setShowEdit(false);
          setContext({
            ...context,
            documentDelete: null
          });
        }
      }

      if (context.groupingUpdate) {
        const { _id, collectionName, type } = context.groupingUpdate;
        if (collectionName === 'Classes' && type === 'material') {
          const tmp = loadedData;
          const idx = tmp.findIndex((el) => el['_id'] === _id);
          // if (idx > -1) {
          //   tmp[idx] = context.groupingUpdate;
          //   setLoadedData(tmp);

          if (_id && editPanelData && editPanelData['_id'] === _id) {
            setEditPanelData(context.groupingUpdate);
          }
          // }
          // }
          setContext({
            ...context,
            groupingUpdate: null
          });
        }
      }
    }
  }, [context]);

  useEffect(() => {
    if (loadedData.length > 0 && isFirst == 1) {
      loadedData.map(
        async (el) =>
          await updateGroupingDocState({
            variables: {
              id: el['_id'],
              collectionName: 'Classes',
              version: el['docState'].version,
              state: null
            }
          })
      );
    }
  }, [isFirst]);

  const checkIsOutSide = (value) => {
    const tmp = value.split('/').length;
    if (tmp > 2) {
      setIsOutSide(true);
    } else {
      setIsOutSide(false);
    }
  };

  const handleMainChange = (type, value) => {
    if (type === 'elSingleClick') {
      setEditTmpData(value);
      setStateContext({
        ...stateContext,
        material: value
      });

      history.push({
        pathname: `/materials/${value['_id']}`
      });
      if (!whenState) {
        setShowEdit(true);
        setEditPanelData(value);
        setSelectedDocId(value['_id']);
        setEditTmpData();
      }
    }

    if (type === 'delete') {
      setShowEdit(false);
    }
  };

  const handleEditChange = (type, value) => {
    if (type === 'update') {
      setWhenState(value);
    }
    if (type === 'delete') {
      setShowEdit(false);
    }
    if (type === 'forceSave') {
      setIsForceSave(value);
    }
  };

  const handleGuardChange = async (value) => {
    setWhenState(false);
    setShowEdit(true);
    if (isOutSide) {
      setEditPanelData(editTmpData);
      setSelectedDocId(editTmpData['_id']);
      setEditTmpData();
    }

    if (value) {
      setForceSaveDocId(editPanelData['_id']);
      setForceSaveDocVersion(editPanelData.docState.version);
      setIsForceSave(true);
    } else {
      if (editPanelData['_id']) {
        await updateGroupingDocState({
          variables: {
            id: editPanelData['_id'],
            collectionName: 'Classes',
            version: editPanelData.docState.version,
            state: null,
            authorId: null
          }
        });
      }
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
      <MaterialMain
        setSelectedDocId={setSelectedDocId}
        setEditPanelData={setEditPanelData}
        setShowEdit={setShowEdit}
        selectedDocId={selectedDocId}
        variables={variables}
        resources={loadedData}
        onChange={handleMainChange}
        selectedTreeItem={selectedTreeItem}
        setSelectedTreeItem={setSelectedTreeItem}
        createGrouping={createGrouping}
        updateGroupingRename={updateGroupingRename}
      />
      {showEdit && (
        <MaterialEdit
          forceSaveDocId={forceSaveDocId}
          forceSaveDocVersion={forceSaveDocVersion}
          forceSave={isForceSave}
          variables={variables}
          resources={editPanelData}
          setWhenState={setWhenState}
          stateResources={stateLoadedData}
          stationResources={stationLoadedData}
          schoolResources={schoolLoadedData}
          districtResources={districtLoadedData}
          classResources={classLoadedData}
          onChange={handleEditChange}
          selectedTreeItem={selectedTreeItem}
        />
      )}
    </Box>
  );
};

export default withRouter(MaterialContainer);
