import React, { useState, useEffect, useContext } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { AvatarUploadForm, DescriptionForm } from '@app/components/Forms';
import AppContext from '@app/AppContext';
import { EditPanel } from '@app/components/Panels';
import { CustomDialog, CustomCheckBox } from '@app/components/Custom';
import { getNotificationOpt } from '@app/constants/Notifications';
import graphql from '@app/graphql';
import * as globalStyles from '@app/constants/globalStyles';

const StateEdit = ({
  forceSaveDocId,
  setWhenState,
  forceSave,
  variables,
  changeDoc,
  resources,
  onChange
}) => {
  const classes = globalStyles.globaluseStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState('');
  const [context] = useContext(AppContext);
  const [canEdit, setCanEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [isTabReset, setIsTabReset] = useState(false);
  const [avatarS3URL, setAvatarS3URL] = useState();
  const [tabStatus, setTabStatus] = useState({});
  const [descData, setDescData] = useState({});
  const [panelSize, setPanelSize] = useState({
    width: 0,
    height: 0
  });
  const [updateGroupingDocState] = useMutation(
    graphql.mutations.updateGroupingDocState
  );

  const [updateGroupingDesc] = useMutation(
    graphql.mutations.updateGroupingDesc
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
      setCheckbox(false);
      setTitle(resources.name);
      // setIsTabReset(true);
      setAvatarS3URL(resources.avatarS3URL?.url || null);
      setTabStatus({
        desc: true,
        right: false
      });

      setDescData(
        resources?.desc || {
          title: '',
          short: '',
          long: ''
        }
      );
      setCanEdit(!resources.docState.state);
      setCanUpdate(!!resources.docState.state);
    }
  }, [resources]);

  useEffect(() => {
    if (forceSave) {
      handleEditPanelChange('save');
    }
  }, [forceSave]);

  const handleFormChange = (type, value) => {
    if (type === 'description') setDescData(value);
    if (type === 'avatarUpload') {
      if (value === 'remove') {
        setAvatarS3URL();
      } else {
        setAvatarS3URL(value);
      }
    }
    setCanUpdate(true);
    onChange('update', true);
  };

  const handleShowPanel = async (value) => {
    setIsTabReset(false);
    if (value === 0) {
      setTabStatus({
        desc: true,
        right: false
      });
    }

    if (value === 1) {
      setTabStatus({
        desc: false,
        right: true
      });
    }
  };

  const handleEditPanelChange = async (type) => {
    try {
      if (type === 'delete') setOpenDelete(true);
      if (type === 'edit') {
        setWhenState(true);
        await updateGroupingDocState({
          variables: {
            id: resources['_id'],
            collectionName: 'Topologies',
            version: resources.docState.version,
            state: 'locked',
            authorId: null
          }
        });
      }

      if (type === 'save') {
        setWhenState(false);
        let descVariableData = {
          id: resources['_id'],
          collectionName: 'Topologies',
          version: resources.docState.version,
          title: descData ? descData.title : '',
          short: descData ? descData.short : '',
          long: descData ? descData.long : ''
        };
        let avatarVariableData = {
          id: resources['_id'],
          collectionName: 'Topologies',
          version: resources.docState.version + 1,
          type: 'state',
          url: avatarS3URL
        };

        if (forceSave) {
          descVariableData = {
            ...descVariableData,
            id: forceSaveDocId
          };

          avatarVariableData = {
            ...avatarVariableData,
            id: forceSaveDocId
          };
        }

        await updateGroupingDesc({
          variables: descVariableData
        });

        await updateGroupingAvatarUrl({
          variables: avatarVariableData
        });

        const notiOps = getNotificationOpt('state', 'success', 'update');
        enqueueSnackbar(notiOps.message, notiOps.options);
        setCanUpdate(false);
        onChange('update', false);
        if (forceSave) onChange('forceSave', false);
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt('state', 'error', 'update');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  const handleDeleteDialogChange = async (type, value) => {
    try {
      if (type === 'btnClick') {
        if (!checkbox && value) {
          const notiOps = getNotificationOpt('state', 'warning', 'delete');
          enqueueSnackbar(notiOps.message, notiOps.options);
          return;
        }

        if (checkbox && value) {
          await deleteDocument({
            variables: {
              id: resources['_id'],
              collectionName: 'Topologies'
            }
          });
          const notiOps = getNotificationOpt('state', 'success', 'delete');
          enqueueSnackbar(notiOps.message, notiOps.options);
          onChange('delete');
        }
        setCheckbox(false);
        setOpenDelete(false);
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt('state', 'error', 'delete');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  return (
    <EditPanel
      title={title}
      panelSize={panelSize}
      canEdit={canEdit}
      canUpdate={canUpdate}
      canDelete
      isTabReset={isTabReset}
      tabSetting={{ desc: true, right: true }}
      onChange={handleEditPanelChange}
      onTabChnage={handleShowPanel}
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
        {tabStatus.desc && (
          <Grid item xs={12} sm={12} md={12} lg={10}>
            <AvatarUploadForm
              disable={!canUpdate}
              resources={avatarS3URL}
              docId={resources['_id']}
              acceptedFiles={['image/png']}
              onChange={(value) => handleFormChange('avatarUpload', value)}
            />

            <DescriptionForm
              disable={!canUpdate}
              resources={descData}
              onChange={(value) => handleFormChange('description', value)}
            />
          </Grid>
        )}
      </Grid>
      <CustomDialog
        open={openDelete}
        title="Do you want to delete this state?"
        mainBtnName="Remove"
        onChange={handleDeleteDialogChange}
      >
        <Typography variant="subtitle1">
          This action will take the removing all info related to current state.
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

export default StateEdit;
