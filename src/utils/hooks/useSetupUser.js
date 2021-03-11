import React, { useState, useEffect, useContext } from 'react';
import AppContext from '@app/AppContext';
import useFetchData from './useFetchData';

// Custom hook to fetch data of admins
// It will take input as variable and output data as result
const useSetupUser = (variables) => {
  const [editPanelData, setEditPanelData] = useState();
  const [showEdit, setShowEdit] = useState(false);
  const [context, setContext] = useContext(AppContext);
  const [
    loadedData,
    setLoadedData,
    selectedData,
    setSelectedData,
    loading,
    error,
    data
  ] = useFetchData(variables);

  useEffect(() => {
    if (context) {
      if (context.groupingAdd) {
        const { collectionName, type } = context.groupingAdd;
        if (collectionName === 'Users' && type === variables['type']) {
          setLoadedData([...loadedData, context.groupingAdd]);
          setContext({
            ...context,
            groupingAdd: null
          });
        }
      }
      if (context.documentDelete) {
        const { _id, collectionName } = context.documentDelete;
        if (collectionName === 'Users') {
          // if (_id === editPanelData['_id']) setShowEdit(false);
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
        if (collectionName === 'Users' && type === variables['type']) {
          const tmp = loadedData;
          const idx = tmp?.findIndex((el) => el['_id'] === _id);
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

  return [
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
  ];
};

export default useSetupUser;
