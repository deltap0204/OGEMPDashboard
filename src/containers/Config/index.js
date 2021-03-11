/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Box, Typography } from '@material-ui/core';
import LoadingSpinner from '@app/components/LoadingSpinner';
import RouteLeavingGuard from '@app/components/RouteLeavingGuard';
import graphql from '@app/graphql';
import AppContext from '@app/AppContext';
import { useStateContext } from '@app/providers/StateContext';
import ConfigMain from './Main';
import ConfigEdit from './Edit';
import useStyles from './style';

const ConfigContainer = ({ history, match }) => {
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
  const [context, setContext] = useContext(AppContext);
  const [stateContext, setStateContext] = useStateContext();
  const variables = {
    id: null,
    collectionName: 'Configs',
    type: 'option',
    parent: null,
    nam: null
  };

  const { loading, error, data } = useQuery(graphql.queries.grouping, {
    variables,
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (stateContext.config) {
      setShowEdit(true);
      setSelectedDocId(stateContext.config['_id']);
      setEditPanelData(stateContext.config);
    }
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      const { grouping } = data;
      setLoadedData(grouping);

      if (!stateContext.config && grouping.length > 0) {
        setShowEdit(true);
        setSelectedDocId(grouping[0]['_id']);
        setEditPanelData(grouping[0]);
      }
    }
  }, [loading, error, data]);

  useEffect(() => {
    if (context) {
      if (context.groupingAdd) {
        const { collectionName, type } = context.groupingAdd;
        if (collectionName === 'Configs' && type === 'option') {
          setLoadedData([...loadedData, context.groupingAdd]);
          setContext({
            ...context,
            groupingAdd: null
          });
        }
      }
      if (context.documentDelete) {
        const { _id, collectionName } = context.documentDelete;
        if (collectionName === 'Configs') {
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
        if (collectionName === 'Configs' && type === 'option') {
          // const tmp = loadedData;
          // const idx = tmp.findIndex((el) => el['_id'] === _id);
          // if (idx > -1) {
          //   tmp[idx] = context.groupingUpdate;
          //   setLoadedData(tmp);

          if (_id && editPanelData['_id'] === _id) {
            setEditPanelData(context.groupingUpdate);
            // }
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
        config: value
      });
      history.push({
        pathname: `/configurations/${value['_id']}`
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
      <ConfigMain
        setSelectedDocId={setSelectedDocId}
        setEditPanelData={setEditPanelData}
        setShowEdit={setShowEdit}
        selectedDocId={selectedDocId}
        variables={variables}
        resources={loadedData}
        onChange={handleMainChange}
      />
      {showEdit && (
        <ConfigEdit
          forceSaveDocId={forceSaveDocId}
          forceSave={isForceSave}
          variables={variables}
          resources={editPanelData}
          onChange={handleEditChange}
        />
      )}
    </Box>
  );
};

export default withRouter(ConfigContainer);
