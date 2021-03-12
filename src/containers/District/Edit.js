import React, { useState, useEffect, useContext } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import AppContext from '@app/AppContext';
import {
  DescriptionForm,
  StationForm,
  StateForm,
  ContactForm,
  AvatarUploadForm
} from '@app/components/Forms';
import { Edit } from '@material-ui/icons';
import { DefaultCard } from '@app/components/Cards';
import { EditPanel } from '@app/components/Panels';
import { CustomDialog, CustomCheckBox } from '@app/components/Custom';
import { EditHelperText, SaveHelperText } from '@app/components/Text';
import { getNotificationOpt } from '@app/constants/Notifications';
import graphql from '@app/graphql';
import * as globalStyles from '@app/constants/globalStyles';

const DistrictEdit = ({
  forceSaveDocId,
  forceSave,
  variables,
  resources,
  stateResources,
  stationResources,
  setWhenState,
  onChange
}) => {
  const classes = globalStyles.globaluseStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState('');
  const [context] = useContext(AppContext);
  const [canUpdate, setCanUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [isTabReset, setIsTabReset] = useState(false);
  const [avatarS3URL, setAvatarS3URL] = useState();
  const [descData, setDescData] = useState({});
  const [topologyData, setTopologyData] = useState({});
  const [detailData, setDetailData] = useState({});
  const [tabStatus, setTabStatus] = useState({});
  const [currentTab, setCurrentTab] = useState(0);
  const [panelSize, setPanelSize] = useState({
    width: 0,
    height: 0
  });

  const [updateGroupingData] = useMutation(
    graphql.mutations.updateGroupingData
  );

  const [updateGroupingDesc] = useMutation(
    graphql.mutations.updateGroupingDesc
  );

  const [updateGroupingTopology] = useMutation(
    graphql.mutations.updateGroupingTopology
  );

  const [updateGroupingAvatarUrl] = useMutation(
    graphql.mutations.updateGroupingAvatarUrl
  );

  const [deleteDocument] = useMutation(graphql.mutations.deleteDocument);

  const [updateGroupingDocState] = useMutation(
    graphql.mutations.updateGroupingDocState
  );

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
      // setIsTabReset(true);
      setAvatarS3URL(resources.avatarS3URL?.url || '');
      // setTabStatus({
      //   desc: true,
      //   topology: false,
      //   people: false,
      //   right: false
      // });
      handleTabStatus(currentTab);

      setDescData(
        resources?.desc || {
          title: '',
          short: '',
          long: ''
        }
      );

      setTopologyData({
        ...topologyData,
        state: resources.topology?.state || '',
        station: resources.topology?.station || ''
      });

      setDetailData({
        ...detailData,
        state: resources.data?.state || '',
        station: resources.data?.station || ''
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

  const handleShowPanel = async (value) => {
    setIsTabReset(false);
    setCurrentTab(value);
    handleTabStatus(value);
  };

  const handleTabStatus = async (value) => {
    if (value === 0) {
      setTabStatus({
        desc: true,
        topology: false,
        people: false,
        right: false
      });
    } else if (value === 1) {
      setTabStatus({
        desc: false,
        topology: true,
        people: false,
        right: false
      });
    } else if (value === 2) {
      setTabStatus({
        desc: false,
        topology: false,
        people: true,
        right: false
      });
    } else if (value === 3) {
      setTabStatus({
        desc: false,
        topology: false,
        people: false,
        right: true
      });
    }
  };

  const handleFormChange = (type, value) => {
    if (type === 'description') setDescData(value);
    if (type === 'avatarUpload') {
      if (value === 'remove') {
        setAvatarS3URL();
      } else {
        setAvatarS3URL(value);
      }
    }
    if (type === 'station' || type === 'state') {
      setTopologyData({
        ...topologyData,
        [type]: value
      });
    }

    setCanUpdate(true);
    onChange('update', true);
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
            state: 'locked'
          }
        });
      }

      if (type === 'save') {
        setWhenState(false);
        let descVraibleData = {
          id: resources['_id'],
          collectionName: 'Topologies',
          version: resources.docState.version,
          title: descData ? descData.title : '',
          short: descData ? descData.short : '',
          long: descData ? descData.long : ''
        };

        let detailVariableData = {
          id: resources['_id'],
          collectionName: 'Topologies',
          version: resources.docState.version + 1,
          data: detailData
        };

        let topologyVariableData = {
          id: resources['_id'],
          collectionName: 'Topologies',
          version: resources.docState.version + 2,
          topology: topologyData
        };

        let avatarVariableData = {
          id: resources['_id'],
          collectionName: 'Topologies',
          version: resources.docState.version + 3,
          type: 'state',
          url: avatarS3URL
        };

        if (forceSave) {
          descVraibleData = {
            ...descVraibleData,
            id: forceSaveDocId
          };

          detailVariableData = {
            ...detailVariableData,
            id: forceSaveDocId
          };

          topologyVariableData = {
            ...topologyVariableData,
            id: forceSaveDocId
          };
          avatarVariableData = {
            ...avatarVariableData,
            id: forceSaveDocId
          };
        }

        await updateGroupingDesc({
          variables: descVraibleData
        });

        await updateGroupingData({
          variables: detailVariableData
        });

        await updateGroupingTopology({
          variables: topologyVariableData
        });

        await updateGroupingAvatarUrl({
          variables: avatarVariableData
        });

        const notiOps = getNotificationOpt('district', 'success', 'update');
        enqueueSnackbar(notiOps.message, notiOps.options);
        setCanUpdate(false);
        onChange('update', false);
        if (forceSave) onChange('forceSave', false);
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt('district', 'error', 'update');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  const handleDeleteDialogChange = async (type, value) => {
    try {
      if (type === 'btnClick') {
        if (!checkbox && value) {
          const notiOps = getNotificationOpt('district', 'warning', 'delete');
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
          const notiOps = getNotificationOpt('district', 'success', 'delete');
          enqueueSnackbar(notiOps.message, notiOps.options);
          onChange('delete');
        }

        setCheckbox(false);
        setOpenDelete(false);
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt('district', 'error', 'delete');
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
        topology: true,
        people: true,
        right: true
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
        {tabStatus.topology && (
          <Grid item xs={12} sm={12} md={12} lg={10}>
            <DefaultCard style={classes.detailCard}>
              <StateForm
                disable={!canUpdate}
                document={resources}
                resources={stateResources}
                customDefaultValue={resources.data?.state}
                onChange={(value) => handleFormChange('state', value)}
                size="small"
              />
              <StationForm
                disable={!canUpdate}
                document={resources}
                resources={stationResources}
                customDefaultValue={resources.data?.station}
                onChange={(value) => handleFormChange('station', value)}
                size="small"
              />
            </DefaultCard>
            {!canUpdate ? <EditHelperText /> : <SaveHelperText />}
          </Grid>
        )}

        {tabStatus.people && (
          <Grid item xs={12} sm={12} md={12} lg={10}>
            <ContactForm />
            {!canUpdate ? <EditHelperText /> : <SaveHelperText />}
          </Grid>
        )}
      </Grid>
      <CustomDialog
        open={openDelete}
        title="Do you want to delete this school district?"
        mainBtnName="Remove"
        onChange={handleDeleteDialogChange}
      >
        <Typography variant="subtitle1">
          This action will take the removing all info related to current school
          district.
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

export default DistrictEdit;
