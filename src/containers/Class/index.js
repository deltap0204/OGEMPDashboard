import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Typography } from '@material-ui/core';
import LoadingSpinner from '@app/components/LoadingSpinner';
import RouteLeavingGuard from '@app/components/RouteLeavingGuard';
import AppContext from '@app/AppContext';
import { useStateContext } from '@app/providers/StateContext';
import graphql from '@app/graphql';
import ClassMain from './Main';
import ClassEdit from './Edit';
import useStyles from './style';

const ClassContainer = ({ history }) => {
  const classes = useStyles();
  const [context, setContext] = useContext(AppContext);
  const [stateContext, setStateContext] = useStateContext();
  const [whenState, setWhenState] = useState(false);
  const [loadedData, setLoadedData] = useState([]);
  const [stateLoadedData, setStateLoadedData] = useState([]);
  const [stationLoadedData, setStationLoadedData] = useState([]);
  const [schoolLoadedData, setSchoolLoadedData] = useState([]);
  const [districtLoadedData, setDistrictLoadedData] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editTmpData, setEditTmpData] = useState();
  const [editPanelData, setEditPanelData] = useState();
  const [isOutSide, setIsOutSide] = useState(false);
  const [isLeavingGuard, setIsLeavingGuard] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState();
  const [isForceSave, setIsForceSave] = useState(false);
  const [topologyData, setTopologyData] = useState({});
  const [forceSaveDocId, setForceSaveDocId] = useState();

  const variables = {
    id: null,
    collectionName: 'Topologies',
    type: 'class',
    parent: null,
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

  const { loading, error, data } = useQuery(graphql.queries.grouping, {
    variables,
    fetchPolicy: 'network-only'
  });

  const [updateGroupingDocState] = useMutation(
    graphql.mutations.updateGroupingDocState
  );

  const [updateGroupingTopology] = useMutation(
    graphql.mutations.updateGroupingTopology
  );

  useEffect(() => {
    if (stateContext.class) {
      setShowEdit(true);
      setSelectedDocId(stateContext.class['_id']);
      setEditPanelData(stateContext.class);
    }
  }, []);

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
    if (!loading && !error) {
      const { grouping } = data;
      setLoadedData(grouping);

      if (!stateContext.class && grouping.length > 0) {
        setShowEdit(true);
        setSelectedDocId(grouping[0]['_id']);
        setEditPanelData(grouping[0]);
        setStateContext({
          ...stateContext,
          class: grouping[0]
        });
      }
    }
  }, [loading, error, data]);

  useEffect(async () => {
    if (context) {
      if (context.groupingAdd) {
        const { collectionName, type } = context.groupingAdd;
        if (collectionName === 'Topologies' && type === 'class') {
          setTopologyData({
            ...topologyData,
            state: stateContext.state?._id || '',
            station: stateContext.station?._id || '',
            school: stateContext.school?._id || '',
            district: stateContext.district?._id || ''
          });

          let topologyVariableData = {
            id: context.groupingAdd['_id'],
            collectionName: 'Topologies',
            version: context.groupingAdd.docState.version + 2,
            topology: topologyData
          };

          const updatedResult = await updateGroupingTopology({
            variables: topologyVariableData
          });

          setShowEdit(true);
          setSelectedDocId(context.groupingAdd['_id']);
          setEditPanelData(context.groupingAdd);
          setLoadedData([...loadedData, updatedResult?.data?.updateGrouping]);
          setStateContext({
            ...stateContext,
            class: context.groupingAdd
          });
          setContext({
            ...context,
            groupingAdd: null
          });
        }
      }
      if (context.documentDelete) {
        const { _id, collectionName } = context.documentDelete;
        if (collectionName === 'Topologies') {
          if (_id === editPanelData['_id']) setShowEdit(false);
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
        if (collectionName === 'Topologies' && type === 'class') {
          // const tmp = loadedData;
          // const idx = tmp.findIndex((el) => el['_id'] === _id);
          // if (idx > -1) {
          //   tmp[idx] = context.groupingUpdate;
          //   setLoadedData(tmp);
          if (_id && editPanelData && editPanelData['_id'] === _id) {
            setEditPanelData(context.groupingUpdate);
          }
          // }
          setContext({
            ...context,
            groupingUpdate: null
          });
        }
      }
    }
  }, [context]);

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
        class: value
      });
      history.push({
        pathname: `/classes/${value['_id']}`
      });
      if (!isLeavingGuard) {
        setShowEdit(true);
        setEditPanelData(value);
        setSelectedDocId(value['_id']);
        setEditTmpData();
      }
    }
  };

  const handleEditChange = (type, value) => {
    if (type === 'update') {
      setIsLeavingGuard(value);
    }
    if (type === 'delete') {
      setShowEdit(false);
      setEditPanelData();
      setStateContext({
        ...stateContext,
        class: null
      });
    }
    if (type === 'forceSave') {
      setIsForceSave(value);
    }
  };

  const handleGuardChange = async (value) => {
    setIsLeavingGuard(false);
    setShowEdit(true);
    if (isOutSide) {
      setEditPanelData(editTmpData);
      setSelectedDocId(editTmpData['_id']);
      setEditTmpData();
    }

    if (value) {
      setForceSaveDocId(editPanelData['_id']);
      setIsForceSave(true);
    } else {
      if (editPanelData['_id']) {
        await updateGroupingDocState({
          variables: {
            id: editPanelData['_id'],
            collectionName: 'Topologies',
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
        when={isLeavingGuard}
        navigate={(path) => {
          history.push(path);
        }}
        shouldBlockNavigation={(location) => {
          checkIsOutSide(location.pathname);
          return isLeavingGuard;
        }}
        onChange={handleGuardChange}
      >
        <Typography variant="subtitle1" className={classes.warning}>
          There are remained some changes on the panel.
          <br />
          Will you discard your current changes?
        </Typography>
      </RouteLeavingGuard>
      <ClassMain
        selectedDocId={selectedDocId}
        variables={variables}
        resources={loadedData}
        onChange={handleMainChange}
      />
      {showEdit && (
        <ClassEdit
          forceSaveDocId={forceSaveDocId}
          forceSave={isForceSave}
          currentUSStates={loadedData}
          variables={variables}
          resources={editPanelData}
          setWhenState={setIsLeavingGuard}
          stateResources={stateLoadedData}
          stationResources={stationLoadedData}
          schoolResources={schoolLoadedData}
          districtResources={districtLoadedData}
          onChange={handleEditChange}
        />
      )}
    </Box>
  );
};

export default withRouter(ClassContainer);
