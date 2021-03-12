import React, { useState, useEffect, useContext } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import AppContext from '@app/AppContext';
import JSONEditor from '@app/components/JSONEditor';
import { EditPanel } from '@app/components/Panels';
import ImageUploader from '@app/components/ImageUploader';
import { EditHelperText, SaveHelperText } from '@app/components/Text';
import { CustomDialog, CustomCheckBox } from '@app/components/Custom';
import { getNotificationOpt } from '@app/constants/Notifications';
import graphql from '@app/graphql';
import * as globalStyles from '@app/constants/globalStyles';

const ConfigEdit = ({
  forceSaveDocId,
  forceSave,
  variables,
  resources,
  onChange
}) => {
  const classes = globalStyles.globaluseStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState('Edit Config');
  const [context] = useContext(AppContext);
  const [canUpdate, setCanUpdate] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [jsonData, setJsonData] = useState(resources.data);
  const [avatarS3URL, setAvatarS3URL] = useState();
  const [panelSize, setPanelSize] = useState({
    width: 0,
    height: 0
  });

  const [updateGroupingDocState] = useMutation(
    graphql.mutations.updateGroupingDocState
  );

  const [updateGroupingData] = useMutation(
    graphql.mutations.updateGroupingData
  );

  const [updateGroupingAvatarUrl] = useMutation(
    graphql.mutations.updateGroupingAvatarUrl
  );

  const [deleteDocument] = useMutation(graphql.mutations.deleteDocument);

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
      setJsonData(resources.data);
      setTitle(resources.name);
      setAvatarS3URL(resources.avatarS3URL?.url || '');

      if (resources.docState) {
        setCanEdit(!resources.docState?.state);
        setCanUpdate(!!resources.docState?.state);
      } else {
        setCanEdit(true);
      }
    }
  }, [resources]);

  useEffect(() => {
    if (forceSave) {
      handleEditPanelChange('save');
    }
  }, [forceSave]);

  const updateAvatarS3URL = async (newURL) => {
    await updateGroupingAvatarUrl({
      variables: {
        id: resources['_id'],
        collectionName: 'Configs',
        version: resources.docState.version,
        url: newURL
      }
    });
    setAvatarS3URL(newURL);
  };

  const handleEditPanelChange = async (type) => {
    try {
      if (type === 'delete') setOpenDelete(true);
      if (type === 'edit') {
        await updateGroupingDocState({
          variables: {
            id: resources['_id'],
            collectionName: 'Configs',
            version: resources.docState.version,
            state: 'locked'
          }
        });
      }
      if (type === 'save') {
        let varaibleData = {
          id: resources['_id'],
          collectionName: 'Configs',
          version: resources.docState.version,
          data: jsonData
        };
        if (forceSave) {
          varaibleData = {
            ...varaibleData,
            id: forceSaveDocId
          };
        }

        await updateGroupingData({
          variables: varaibleData
        });

        setCanUpdate(false);
        onChange('update', false);
        const notiOps = getNotificationOpt('config', 'success', 'update');
        enqueueSnackbar(notiOps.message, notiOps.options);
        if (forceSave) onChange('forceSave', false);
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt('config', 'error', 'update');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  const handleJSONEditorChange = (value) => {
    setJsonData({
      ...jsonData,
      ...value
    });
    setCanUpdate(true);
    onChange('update', true);
  };

  const handleDeleteDialogChange = async (type, value) => {
    try {
      if (type === 'btnClick') {
        if (!checkbox && value) {
          const notiOps = getNotificationOpt('config', 'warning', 'delete');
          enqueueSnackbar(notiOps.message, notiOps.options);
          return;
        }

        if (checkbox && value) {
          await deleteDocument({
            variables: {
              id: resources['_id'],
              collectionName: 'Configs'
            }
          });
          const notiOps = getNotificationOpt('config', 'success', 'delete');
          enqueueSnackbar(notiOps.message, notiOps.options);
          onChange('delete');
        }

        setCheckbox(false);
        setOpenDelete(false);
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt('config', 'error', 'delete');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  return (
    <EditPanel
      title={title}
      panelSize={panelSize}
      canDelete
      canEdit={canEdit}
      canUpdate={canUpdate}
      onChange={handleEditPanelChange}
    >
      <Typography variant="subtitle2" className={classes.docId}>
        ID: {resources['_id']}{' '}
        {resources.parent ? `/ Parent: ${resources.parent}` : []}{' '}
        {resources.docState.version ? `/ ${resources.docState.version}` : []}
      </Typography>
      <ImageUploader
        resourceID={resources['_id']}
        resourceName="Configs"
        acceptedFiles={['image/png']}
        updateAvatarS3URL={updateAvatarS3URL}
        avatarS3URL={avatarS3URL}
      />
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <JSONEditor
            disable={!canUpdate}
            resources={resources.data}
            onChange={handleJSONEditorChange}
          />
          {!canUpdate ? <EditHelperText /> : <SaveHelperText />}
        </Grid>
      </Grid>
      <CustomDialog
        open={openDelete}
        title="Do you want to delete this configuration?"
        mainBtnName="Remove"
        onChange={handleDeleteDialogChange}
      >
        <Typography variant="subtitle1">
          This action will take the removing all info related to current
          configuration.
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

export default ConfigEdit;
