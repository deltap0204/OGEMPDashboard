import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router';
import { useQuery } from '@apollo/client';
import { Box } from '@material-ui/core';
import LoadingSpinner from '@app/components/LoadingSpinner';
import AppContext from '@app/AppContext';
import graphql from '@app/graphql';
import UserMain from './Main';
import UserEdit from './Edit';
import useStyles from './style';

const UserContainer = ({ history, match }) => {
  const classes = useStyles();
  const [context, setContext] = useContext(AppContext);
  const [showEdit, setShowEdit] = useState(true);
  const [loadedData, setLoadedData] = useState([]);
  const [editPanelData, setEditPanelData] = useState({});
  const [variables, setVariables] = useState({
    id: null,
    collectionName: 'Users',
    type: null,
    name: null,
    parent: null
  });

  useEffect(() => {
    setVariables({
      ...variables,
      type: match.params?.type || null
    });
  }, [match]);

  const { loading, error, data } = useQuery(graphql.queries.grouping, {
    variables,
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (!loading && !error) {
      const { grouping } = data;
      setLoadedData(grouping);
    }
  }, [loading, error, data]);

  useEffect(() => {
    if (context) {
      if (context.groupingAdd) {
        const { collectionName, type } = context.groupingAdd;
        if (collectionName === 'Topologies' && type === 'state') {
          setLoadedData([...loadedData, context.groupingAdd]);
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
        if (collectionName === 'Topologies' && type === 'state') {
          const tmp = loadedData;
          const idx = tmp.findIndex((el) => el['_id'] === _id);
          if (idx > -1) {
            tmp[idx] = context.groupingUpdate;
            setLoadedData(tmp);

            if (_id && editPanelData['_id'] === _id) {
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

  const handleMainChange = (type, value) => {};

  return (
    <Box className={classes.root}>
      <LoadingSpinner loading={loading} />
      <UserMain
        resources={loadedData}
        variables={variables}
        onChange={handleMainChange}
      />
      {showEdit && <UserEdit />}
    </Box>
  );
};

export default withRouter(UserContainer);
