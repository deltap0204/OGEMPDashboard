import React, { useState, useEffect, useContext } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import AppContext from '@app/AppContext';
import { EditPanel } from '@app/components/Panels';
import { CustomDialog, CustomCheckBox } from '@app/components/Custom';
import { getNotificationOpt } from '@app/constants/Notifications';
import graphql from '@app/graphql';
import * as globalStyles from '@app/constants/globalStyles';

const ArchiveEdit = ({
  forceSaveDocId,
  forceSave,
  variables,
  resources,
  onChange
}) => {
  const classes = globalStyles.globaluseStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState('');
  const [context] = useContext(AppContext);
  const [canUpdate, setCanUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [canDelete, setCanDelete] = useState(true);
  const [checkbox, setCheckbox] = useState(false);
  const [panelSize, setPanelSize] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    if (context) {
      const { width, height } = context.containerSize;
      setPanelSize({ width: width - 300, height });
    }
  }, [context]);

  useEffect(() => {
    if (resources) {
      setCanUpdate(false);
      setCheckbox(false);
      setTitle(resources.name);
    }
  }, [resources]);

  useEffect(() => {
    if (forceSave) {
      handleEditPanelChange('save');
    }
  }, [forceSave]);

  const [updateGroupingData] = useMutation(
    graphql.mutations.updateGroupingData,
    {
      update(cache, { data: { updateGrouping } }) {
        cache.modify({
          id: resources['_id'],
          fields: {
            data(cacheData) {
              return { ...cacheData, ...updateGrouping.data };
            }
          }
        });
      }
    }
  );

  const [deleteDocument] = useMutation(graphql.mutations.deleteDocument, {
    update(cache) {
      const existingGroups = cache.readQuery({
        query: graphql.queries.grouping,
        variables
      });
      const { grouping } = existingGroups;
      const newData = grouping.filter((el) => el['_id'] !== resources['_id']);
      cache.writeQuery({
        query: graphql.queries.grouping,
        variables,
        data: {
          grouping: newData
        }
      });
    }
  });

  const handleEditPanelChange = async (type) => {
    try {
      if (type === 'delete') setOpenDelete(true);
      if (type === 'save') {
        // let varaibleData = {
        //   id: resources['_id'],
        //   collectionName: '',
        //   data: // Do anything whatever you'd like for the edit panel
        // };

        // if (forceSave) {
        //   varaibleData = {
        //     ...varaibleData,
        //     id: forceSaveDocId
        //   };
        // }

        // await updateGroupingData({
        //   variables: varaibleData
        // });
        setCanUpdate(false);
        onChange('update', false);
        const notiOps = getNotificationOpt('archive', 'success', 'delete');
        enqueueSnackbar(notiOps.message, notiOps.options);
        if (forceSave) onChange('forceSave', false);
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt('archive', 'error', 'update');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  const handleDeleteDialogChange = async (type, value) => {
    try {
      if (type === 'btnClick') {
        if (!checkbox && value) {
          const notiOps = getNotificationOpt('archive', 'warning', 'delete');
          enqueueSnackbar(notiOps.message, notiOps.options);
          return;
        }

        if (checkbox && value) {
          await deleteDocument({
            variables: {
              id: resources['_id'],
              collectionName: 'Archives'
            }
          });
          const notiOps = getNotificationOpt('archive', 'success', 'delete');
          enqueueSnackbar(notiOps.message, notiOps.options);
          onChange('delete');
        }

        setCheckbox(false);
        setOpenDelete(false);
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt('archive', 'error', 'delete');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  return (
    <EditPanel
      title={title}
      panelSize={panelSize}
      canDelete={canDelete}
      canUpdate={canUpdate}
      onChange={handleEditPanelChange}
    >
      <Typography variant="subtitle2" className={classes.docId}>
        ID: {resources['_id']}{' '}
        {resources.parent ? `/ Parent: ${resources.parent}` : []}{' '}
        {resources.docState.version ? `/ ${resources.docState.version}` : []}
      </Typography>

      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12} sm={12} md={12} lg={12}></Grid>
      </Grid>
      <CustomDialog
        open={openDelete}
        title="Do you want to delete this archive?"
        mainBtnName="Remove"
        onChange={handleDeleteDialogChange}
      >
        <Typography variant="subtitle1">
          This action will take the removing all info related to current
          archive.
        </Typography>
        <CustomCheckBox
          color="primary"
          value={checkbox}
          label="I agree with this action."
          onChange={(value) => setCheckbox(!value)}
        />
      </CustomDialog>
    </EditPanel>
  );
};

export default ArchiveEdit;
