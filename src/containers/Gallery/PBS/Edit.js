import React, { useState, useEffect, useContext } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import {
  DescriptionForm,
  AttachmentForm,
  AvatarUploadForm,
  MultiTagsForm,
  ContactForm
} from '@app/components/Forms';
import AppContext from '@app/AppContext';
import { EditPanel } from '@app/components/Panels';
import { CustomDialog, CustomCheckBox } from '@app/components/Custom';
import TextEditor from '@app/components/TextEditor';
import { getNotificationOpt } from '@app/constants/Notifications';
import graphql from '@app/graphql';
import * as globalStyles from '@app/constants/globalStyles';

const PBSEdit = ({
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
  const [detailData, setDetailData] = useState({});
  const [currentTab, setCurrentTab] = useState(0);

  const [updateGroupingDocState] = useMutation(
    graphql.mutations.updateGroupingDocState
  );

  const [updateGroupingDesc] = useMutation(
    graphql.mutations.updateGroupingDesc
  );

  const [updateGroupingData] = useMutation(
    graphql.mutations.updateGroupingData
  );

  const [updateGroupingAvatarUrl] = useMutation(
    graphql.mutations.updateGroupingAvatarUrl
  );

  const [deleteDocument] = useMutation(graphql.mutations.deleteDocument);

  const [updateGroupingAssetURLs] = useMutation(
    graphql.mutations.updateGroupingAssetURLs
  );

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
      handleTabStatus(currentTab);

      setDescData(
        resources?.desc || {
          title: '',
          short: '',
          long: ''
        }
      );

      setDetailData({
        ...detailData,
        state: resources.data?.state || '',
        body: resources.data?.body || null
      });

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
    if (type === 'textEditor') {
      setDetailData({
        ...detailData,
        body: value
      });
    }
    setCanUpdate(true);
    onChange('update', true);
  };

  const handleShowPanel = async (value) => {
    setIsTabReset(false);
    setCurrentTab(value);
    handleTabStatus(value);
  };

  const handleTabStatus = async (value) => {
    if (value === 0) {
      setTabStatus({
        desc: true,
        htmlEditor: false,
        categories: false,
        asset: false
      });
    } else if (value === 1) {
      setTabStatus({
        desc: false,
        htmlEditor: true,
        categories: false,
        asset: false
      });
    } else if (value === 2) {
      setTabStatus({
        desc: false,
        htmlEditor: false,
        categories: true,
        asset: false
      });
    } else if (value === 3) {
      setTabStatus({
        desc: false,
        htmlEditor: false,
        categories: false,
        asset: true
      });
    }
  };

  const handleAttFormChange = async (type, value) => {
    try {
      let assetUrlVariables = {
        id: resources['_id'],
        collectionName: 'Classes',
        version: resources.docState.version,
        data: []
      };

      if (type === 'upload') {
        assetUrlVariables = {
          ...assetUrlVariables,
          data: value
        };
      }

      if (type === 'delete') {
        const tmp = resources.assetURLs?.internal.filter(
          (el) => el.url !== value.url
        );

        assetUrlVariables = {
          ...assetUrlVariables,
          data: tmp
        };
      }

      if (type === 'update') {
        const tmp = resources.assetURLs?.internal.slice();
        const idx = tmp.findIndex((el) => el.url === value.url);
        tmp[idx] = { ...tmp[idx], ...value };

        assetUrlVariables = {
          ...assetUrlVariables,
          data: tmp
        };
      }
      await updateGroupingAssetURLs({
        variables: assetUrlVariables
      });
    } catch (error) {
      console.log(error.message);
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
            collectionName: 'PBS',
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
          collectionName: 'PBS',
          version: resources.docState.version,
          title: descData ? descData.title : '',
          short: descData ? descData.short : '',
          long: descData ? descData.long : ''
        };
        let avatarVariableData = {
          id: resources['_id'],
          collectionName: 'PBS',
          version: resources.docState.version + 1,
          type: 'state',
          url: avatarS3URL
        };

        let detailVariableData = {
          id: resources['_id'],
          collectionName: 'PBS',
          version: resources.docState.version + 2,
          data: detailData
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

          detailVariableData = {
            ...detailVariableData,
            id: forceSaveDocId
          };
        }

        await updateGroupingDesc({
          variables: descVariableData
        });

        await updateGroupingAvatarUrl({
          variables: avatarVariableData
        });

        await updateGroupingData({
          variables: detailVariableData
        });

        const notiOps = getNotificationOpt('pbs', 'success', 'update');
        enqueueSnackbar(notiOps.message, notiOps.options);
        setCanUpdate(false);
        onChange('update', false);
        if (forceSave) onChange('forceSave', false);
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt('pbs', 'error', 'update');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  const handleDeleteDialogChange = async (type, value) => {
    try {
      if (type === 'btnClick') {
        if (!checkbox && value) {
          const notiOps = getNotificationOpt('pbs', 'warning', 'delete');
          enqueueSnackbar(notiOps.message, notiOps.options);
          return;
        }

        if (checkbox && value) {
          await deleteDocument({
            variables: {
              id: resources['_id'],
              collectionName: 'PBS'
            }
          });
          const notiOps = getNotificationOpt('pbs', 'success', 'delete');
          enqueueSnackbar(notiOps.message, notiOps.options);
          onChange('delete');
        }
        setCheckbox(false);
        setOpenDelete(false);
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt('pbs', 'error', 'delete');
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
      tabSetting={{
        desc: true,
        htmlEditor: true,
        categories: true,
        asset: true
      }}
      isTabReset={isTabReset}
      onChange={handleEditPanelChange}
      onTabChnage={handleShowPanel}
    >
      <Typography variant="subtitle2" className={classes.docId}>
        ID: {resources['_id']}{' '}
        {resources.parent ? `/ Parent: ${resources.parent}` : []}{' '}
        {resources.docState.version ? `/ ${resources.docState.version}` : []}
      </Typography>

      <Grid
        spacing={globalStyles.GridSpacingStyles}
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12} sm={12} md={12} lg={10}>
          {tabStatus.desc && (
            <React.Fragment>
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
            </React.Fragment>
          )}
        </Grid>

        {tabStatus.htmlEditor && (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextEditor
              disable={!canUpdate}
              docId={resources['_id']}
              resources={resources}
              onChange={(value) => handleFormChange('textEditor', value)}
            />
          </Grid>
        )}

        {tabStatus.categories && (
          <Grid item xs={12} sm={12} md={12} lg={10}>
            <MultiTagsForm />
          </Grid>
        )}

        {/* {tabStatus.asset && (
          <Grid item xs={12} sm={12} md={12} lg={10}>
            <AttachmentForm
              disable={!canUpdate}
              docId={resources['_id']}
              resources={resources.assetURLs}
              onChange={handleAttFormChange}
            />
          </Grid>
        )} */}
      </Grid>
      <CustomDialog
        open={openDelete}
        title="Do you want to delete this gallery?"
        mainBtnName="Remove"
        onChange={handleDeleteDialogChange}
      >
        <Typography variant="subtitle1">
          This action will take the removing all info related to current
          gallery.
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

export default PBSEdit;
