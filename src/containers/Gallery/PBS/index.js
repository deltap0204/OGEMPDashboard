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
import PBSMain from './Main';
import PBSEdit from './Edit';
import useStyles from './style';

const PBSContainer = ({ history, match }) => {
  const classes = useStyles();
  const [showEdit, setShowEdit] = useState(false);
  const [whenState, setWhenState] = useState(false);
  const [isOutSide, setIsOutSide] = useState(false);
  const [loadedData, setLoadedData] = useState([]);
  const [stateLoadedData, setStateLoadedData] = useState([]);
  const [stationLoadedData, setStationLoadedData] = useState([]);
  const [editPanelData, setEditPanelData] = useState();
  const [editTmpData, setEditTmpData] = useState();
  const [selectedDocId, setSelectedDocId] = useState();
  const [isForceSave, setIsForceSave] = useState(false);
  // const [topologyData, setTopologyData] = useState({});
  const [forceSaveDocId, setForceSaveDocId] = useState();
  const [context, setContext] = useContext(AppContext);
  const [stateContext, setStateContext] = useStateContext();

  const [isFirst, setIsFirst] = useState(0);
  const variables = {
    id: null,
    collectionName: 'PBS',
    type: 'gallery',
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

  const { loading, error, data } = useQuery(graphql.queries.grouping, {
    variables,
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (stateContext.pbs) {
      setShowEdit(true);
      setSelectedDocId(stateContext.pbs['_id']);
      setEditPanelData(stateContext.pbs);
    }
  }, []);
  // const [updateGroupingDocState] = useMutation(
  //   graphql.mutations.updateGroupingDocState
  // );

  // const [updateGroupingTopology] = useMutation(
  //   graphql.mutations.updateGroupingTopology
  // );

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

  useEffect(() => {
    if (!stationLoading && !stationError) {
      const { grouping } = stationData;
      if (stationVariables.parent) {
        const stationList = [];
        grouping.map((item) =>
          stationList.push({ label: item['name'], value: item['_id'] })
        );
        setStationLoadedData(stationList);
      } else {
        const stationList = [];
        grouping
          .filter((el) => el.parent === null)
          .map((item) =>
            stationList.push({ label: item['name'], value: item['_id'] })
          );
        setStationLoadedData(stationList);
      }
    }
  }, [stationLoading, stationError, stationData]);

  useEffect(() => {
    if (!stateLoading && !stateError) {
      const { grouping } = stateData;
      if (stateVariables.parent) {
        const stateList = [];
        grouping.map((item) =>
          stateList.push({ label: item['name'], value: item['_id'] })
        );
        setStateLoadedData(stateList);
      } else {
        const stateList = [];
        grouping
          .filter((el) => el.parent === null)
          .map((item) =>
            stateList.push({ label: item['name'], value: item['_id'] })
          );
        setStateLoadedData(stateList);
      }
    }
  }, [stateLoading, stateError, stateData]);

  useEffect(() => {
    if (!loading && !error) {
      const { grouping } = data;
      setLoadedData(grouping);

      if (!stateContext.district && grouping.length > 0) {
        setShowEdit(true);
        setSelectedDocId(grouping[0]['_id']);
        setEditPanelData(grouping[0]);
      }
      setIsFirst(isFirst + 1);
    }
  }, [loading, error, data]);

  useEffect(async () => {
    if (context) {
      if (context.groupingAdd) {
        const { collectionName, type } = context.groupingAdd;
        if (collectionName === 'PBS' && type === 'gallery') {
          setShowEdit(true);
          setSelectedDocId(context.groupingAdd['_id']);
          setEditPanelData(context.groupingAdd);
          setLoadedData([...loadedData, context.groupingAdd]);
          // setLoadedData([...loadedData, updatedResult?.data?.updateGrouping]);
          setContext({
            ...context,
            groupingAdd: null
          });
          setStateContext({
            ...stateContext,
            district: context.groupingAdd
          });
        }
      }
      if (context.documentDelete) {
        const { _id, collectionName } = context.documentDelete;
        if (collectionName === 'PBS') {
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
        if (collectionName === 'PBS' && type === 'gallery') {
          const tmp = loadedData.slice();
          const idx = tmp.findIndex((el) => el['_id'] === _id);
          if (idx > -1) {
            tmp[idx] = context.groupingUpdate;
            setLoadedData(tmp);

            if (_id && editPanelData && editPanelData['_id'] === _id) {
              setEditPanelData(context.groupingUpdate);
            }
          }
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
        pbs: value
      });
      history.push({
        pathname: `/galleries/pbs/${value['_id']}`
      });
      if (!whenState) {
        setShowEdit(true);
        setEditPanelData(value);
        setSelectedDocId(value['_id']);
        setEditTmpData();
      }
    }

    if (type === 'delete') {
      console.log('clicked the delete');
      setShowEdit(false);
      setEditPanelData();
      setStateContext({
        ...stateContext,
        pbs: null
      });
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

  const handleGuardChange = (value) => {
    setWhenState(false);
    setShowEdit(true);
    if (isOutSide) {
      setEditPanelData(editTmpData);
      setSelectedDocId(editTmpData['_id']);
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
      <PBSMain
        selectedDocId={selectedDocId}
        variables={variables}
        resources={loadedData}
        onChange={handleMainChange}
      />
      {showEdit && (
        <PBSEdit
          forceSaveDocId={forceSaveDocId}
          forceSave={isForceSave}
          variables={variables}
          resources={editPanelData}
          stateResources={stateLoadedData}
          stationResources={stationLoadedData}
          onChange={handleEditChange}
        />
      )}
    </Box>
  );
};

export default withRouter(PBSContainer);
