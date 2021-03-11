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
import StationMain from './Main';
import StationEdit from './Edit';
import useStyles from './style';

const StationContainer = ({ history, match }) => {
  const classes = useStyles();
  const [isOutSide, setIsOutSide] = useState(false);
  const [loadedData, setLoadedData] = useState([]);
  const [stateLoadedData, setStateLoadedData] = useState([]);
  const [editPanelData, setEditPanelData] = useState();
  const [editTmpData, setEditTmpData] = useState();
  const [showEdit, setShowEdit] = useState(false);
  const [whenState, setWhenState] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState();
  const [isForceSave, setIsForceSave] = useState(false);
  const [forceSaveDocId, setForceSaveDocId] = useState();
  const [context, setContext] = useContext(AppContext);
  const [stateContext, setStateContext] = useStateContext();
  const [isFirst, setIsFirst] = useState(0);

  const variables = {
    id: null,
    collectionName: 'Topologies',
    type: 'station',
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

  const { loading, error, data } = useQuery(graphql.queries.grouping, {
    variables,
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (stateContext.station) {
      setShowEdit(true);
      setSelectedDocId(stateContext.station['_id']);
      setEditPanelData(stateContext.station);
    }
  }, []);
  const [updateGroupingDocState] = useMutation(
    graphql.mutations.updateGroupingDocState
  );

  const [updateGroupingTopology] = useMutation(
    graphql.mutations.updateGroupingTopology
  );

  const {
    loading: stateLoading,
    error: stateError,
    data: stateData
  } = useQuery(graphql.queries.grouping, {
    variables: stateVariables,
    fetchPolicy: 'network-only'
  });

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
      if (!stateContext.station && grouping.length > 0) {
        setShowEdit(true);
        setSelectedDocId(grouping[0]['_id']);
        setEditPanelData(grouping[0]);
        setStateContext({
          ...stateContext,
          station: grouping[0]
        });
      }
      setIsFirst(isFirst + 1);
    }
  }, [loading, error, data]);

  useEffect(async () => {
    if (context) {
      if (context.groupingAdd) {
        const { collectionName, type } = context.groupingAdd;
        if (collectionName === 'Topologies' && type === 'station') {
          if (stateContext.state) {
            let topologyVariableData = {
              id: context.groupingAdd['_id'],
              collectionName: 'Topologies',
              version: context.groupingAdd.docState.version + 2,
              topology: {
                state: stateContext.state['_id'] || ''
              }
            };

            const updatedResult = await updateGroupingTopology({
              variables: topologyVariableData
            });

            setLoadedData([...loadedData, updatedResult?.data?.updateGrouping]);
          } else {
            setLoadedData([...loadedData, context.groupingAdd]);
          }

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
        if (collectionName === 'Topologies' && type === 'station') {
          const tmp = loadedData;
          const idx = tmp.findIndex((el) => el['_id'] === _id);
          // if (idx > -1) {
          // tmp[idx] = context.groupingUpdate;
          // setLoadedData(tmp);

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
              collectionName: 'Topologies',
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
        station: value
      });
      history.push({
        pathname: `/stations/${value['_id']}`
      });
      if (!whenState) {
        setShowEdit(true);
        setEditPanelData(value);
        setSelectedDocId(value['_id']);
        setEditTmpData();
      }
    }
  };

  const handleEditChange = (type, value) => {
    if (type === 'update') {
      setWhenState(value);
    }
    if (type === 'delete') {
      setShowEdit(false);
      setEditPanelData();
      setStateContext({
        ...stateContext,
        station: null
      });
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
      <StationMain
        setSelectedDocId={setSelectedDocId}
        setEditPanelData={setEditPanelData}
        setShowEdit={setShowEdit}
        selectedDocId={selectedDocId}
        variables={variables}
        resources={loadedData}
        onChange={handleMainChange}
      />
      {showEdit && (
        <StationEdit
          forceSaveDocId={forceSaveDocId}
          forceSave={isForceSave}
          variables={variables}
          resources={editPanelData}
          setWhenState={setWhenState}
          stateResources={stateLoadedData}
          onChange={handleEditChange}
        />
      )}
    </Box>
  );
};

export default withRouter(StationContainer);
