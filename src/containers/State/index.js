/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Box, Typography } from '@material-ui/core';
import LoadingSpinner from '@app/components/LoadingSpinner';
import RouteLeavingGuard from '@app/components/RouteLeavingGuard';
import AppContext from '@app/AppContext';
import { useStateContext } from '@app/providers/StateContext';
import { useMutation } from '@apollo/client';
import graphql from '@app/graphql';
import StateMain from './Main';
import StateEdit from './Edit';
import useStyles from './style';

const StateContainer = ({ history, match }) => {
  const classes = useStyles();
  const [showEdit, setShowEdit] = useState(false);
  const [whenState, setWhenState] = useState(false);
  const [isOutSide, setIsOutSide] = useState(false);
  const [loadedData, setLoadedData] = useState([]);
  const [editPanelData, setEditPanelData] = useState();
  const [editTmpData, setEditTmpData] = useState();
  const [selectedDocId, setSelectedDocId] = useState();
  const [isForceSave, setIsForceSave] = useState(false);
  const [forceSaveDocId, setForceSaveDocId] = useState();
  const [appContext, setAppContext] = useContext(AppContext);
  const [stateContext, setStateContext] = useStateContext();

  const variables = {
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

  const [updateGroupingDocState] = useMutation(
    graphql.mutations.updateGroupingDocState
  );

  useEffect(() => {
    if (stateContext.state) {
      setShowEdit(true);
      setSelectedDocId(stateContext.state['_id']);
      setEditPanelData(stateContext.state);
    }
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      const { grouping } = data;
      setLoadedData(grouping);

      if (!stateContext.state && grouping.length > 0) {
        setShowEdit(true);
        setSelectedDocId(grouping[0]['_id']);
        setEditPanelData(grouping[0]);
        setStateContext({
          ...stateContext,
          state: grouping[0]
        });
      }
    }
  }, [loading, error, data]);

  useEffect(() => {
    if (appContext) {
      if (appContext.groupingAdd) {
        const { collectionName, type } = appContext.groupingAdd;
        if (collectionName === 'Topologies' && type === 'state') {
          setShowEdit(true);
          setSelectedDocId(appContext.groupingAdd['_id']);
          setEditPanelData(appContext.groupingAdd);
          setLoadedData([...loadedData, appContext.groupingAdd]);
          setAppContext({
            ...appContext,
            groupingAdd: null
          });
          setStateContext({
            ...stateContext,
            state: appContext.groupingAdd
          });
        }
      }
      if (appContext.documentDelete) {
        const { _id, collectionName } = appContext.documentDelete;
        if (collectionName === 'Topologies') {
          if (_id && _id === editPanelData['_id']) setShowEdit(false);
          const tmp = loadedData.filter((el) => el['_id'] !== _id);
          setLoadedData(tmp);
          if (tmp.length === 0) setShowEdit(false);
          setAppContext({
            ...appContext,
            documentDelete: null
          });
        }
      }

      if (appContext.groupingUpdate) {
        const { _id, collectionName, type } = appContext.groupingUpdate;
        if (collectionName === 'Topologies' && type === 'state') {
          const tmp = loadedData.slice();
          const idx = tmp.findIndex((el) => el['_id'] === _id);
          if (idx > -1) {
            tmp[idx] = appContext.groupingUpdate;
            setLoadedData(tmp);

            if (_id && editPanelData && editPanelData['_id'] === _id) {
              setEditPanelData(appContext.groupingUpdate);
            }
          }
          setAppContext({
            ...appContext,
            groupingUpdate: null
          });
        }
      }
    }
  }, [appContext]);

  const checkIsOutSide = (value) => {
    const tmp = value.split('/').length;
    if (tmp > 2) {
      setIsOutSide(true);
    } else {
      setIsOutSide(false);
    }
  };

  const handleMainChange = (type, value) => {
    if (type === 'elClick') {
      setEditTmpData(value);
      setStateContext({
        ...stateContext,
        state: value
      });
      history.push({
        pathname: `/states/${value['_id']}`
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
        state: null
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
      <StateMain
        selectedDocId={selectedDocId}
        variables={variables}
        resources={loadedData}
        onChange={handleMainChange}
      />
      {showEdit && (
        <StateEdit
          forceSaveDocId={forceSaveDocId}
          forceSave={isForceSave}
          variables={variables}
          resources={editPanelData}
          onChange={handleEditChange}
          setWhenState={setWhenState}
        />
      )}
    </Box>
  );
};

export default withRouter(StateContainer);
