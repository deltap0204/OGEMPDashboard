import React, { useState, useEffect, useContext } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import {
  DescriptionForm,
  AvatarUploadForm,
  StateForm,
  StationForm,
  SchoolForm,
  DistrictForm,
  ContactForm
} from '@app/components/Forms';
import AppContext from '@app/AppContext';
import { Edit } from '@material-ui/icons';
import { EditPanel } from '@app/components/Panels';
import { EditHelperText, SaveHelperText } from '@app/components/Text';
import { CustomDialog, CustomCheckBox } from '@app/components/Custom';
import { getNotificationOpt } from '@app/constants/Notifications';
import graphql from '@app/graphql';
import * as globalStyles from '@app/constants/globalStyles';
import { DefaultCard } from '@app/components/Cards';

const ClassEdit = ({
  forceSaveDocId,
  forceSave,
  variables,
  resources,
  setWhenState,
  stateResources,
  stationResources,
  schoolResources,
  districtResources,
  onChange
}) => {
  const [canEdit, setCanEdit] = useState(false);
  const classes = globalStyles.globaluseStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState('');
  const [context] = useContext(AppContext);
  const [canUpdate, setCanUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [avatarS3URL, setAvatarS3URL] = useState();
  const [panelSize, setPanelSize] = useState({
    width: 0,
    height: 0
  });
  const [descData, setDescData] = useState({});
  const [detailData, setDetailData] = useState({});
  const [topologyData, setTopologyData] = useState({});
  const [tabStatus, setTabStatus] = useState({});
  const [isTabReset, setIsTabReset] = useState(false);
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

  const [updateGroupingTopology] = useMutation(
    graphql.mutations.updateGroupingTopology
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
        station: resources.topology?.station || '',
        school: resources.topology?.school || '',
        district: resources.topology?.district || ''
      });

      setDetailData({
        ...detailData,
        state: resources.data?.state || ''
      });

      setCanEdit(!resources.docState?.state);
      setCanUpdate(!!resources.docState?.state);
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
        teachers: false,
        students: false,
        right: false
      });
    }

    if (value === 1) {
      setTabStatus({
        desc: false,
        topology: true,
        teachers: false,
        students: false,
        right: false
      });
    }
    if (value === 2) {
      setTabStatus({
        desc: false,
        topology: false,
        teachers: true,
        students: false,
        right: false
      });
    }
    if (value === 3) {
      setTabStatus({
        desc: false,
        topology: false,
        teachers: false,
        students: true,
        right: false
      });
    }
    if (value === 4) {
      setTabStatus({
        desc: false,
        topology: false,
        teachers: false,
        students: false,
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
    if (
      type === 'station' ||
      type === 'state' ||
      type === 'school' ||
      type === 'district'
    ) {
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
            collectionName: 'Materials',
            version: resources.docState.version,
            state: 'locked'
          }
        });
      }

      if (type === 'save') {
        setWhenState(false);
        const docId = resources['_id'];
        let descVraibleData = {
          id: docId,
          collectionName: 'Materials',
          version: resources.docState.version,
          title: descData ? descData.title : '',
          short: descData ? descData.short : '',
          long: descData ? descData.long : ''
        };

        let detailVariableData = {
          id: docId,
          collectionName: 'Materials',
          version: resources.docState.version + 1,
          data: detailData
        };

        let topologyVariableData = {
          id: resources['_id'],
          collectionName: 'Materials',
          version: resources.docState.version + 2,
          topology: topologyData
        };

        let avatarVariableData = {
          id: resources['_id'],
          collectionName: 'Materials',
          version: resources.docState.version + 3,
          type: 'class',
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

        const notiOps = getNotificationOpt('class', 'success', 'update');
        enqueueSnackbar(notiOps.message, notiOps.options);
        setCanUpdate(false);
        onChange('update', false);
        if (forceSave) onChange('forceSave', false);
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt('class', 'error', 'update');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  const handleDeleteDialogChange = async (type, value) => {
    try {
      if (type === 'btnClick') {
        if (!checkbox && value) {
          const notiOps = getNotificationOpt('class', 'warning', 'delete');
          enqueueSnackbar(notiOps.message, notiOps.options);
          return;
        }

        if (checkbox && value) {
          await deleteDocument({
            variables: {
              id: resources['_id'],
              collectionName: 'Materials'
            }
          });
          const notiOps = getNotificationOpt('class', 'success', 'delete');
          enqueueSnackbar(notiOps.message, notiOps.options);
          onChange('delete');
        }

        setCheckbox(false);
        setOpenDelete(false);
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt('class', 'error', 'delete');
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
        teachers: true,
        students: true,
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
        container
        spacing={0}
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
              <DistrictForm
                disable={!canUpdate}
                document={resources}
                resources={districtResources}
                customDefaultValue={resources.data?.district}
                onChange={(value) => handleFormChange('district', value)}
                size="small"
              />
              <SchoolForm
                disable={!canUpdate}
                document={resources}
                resources={schoolResources}
                customDefaultValue={resources.data?.school}
                onChange={(value) => handleFormChange('school', value)}
                size="small"
              />
            </DefaultCard>
            {!canUpdate ? <EditHelperText /> : <SaveHelperText />}
          </Grid>
        )}
        {tabStatus.teachers && <>Teacher</>}

        {tabStatus.students && <>Student</>}
      </Grid>
      <CustomDialog
        open={openDelete}
        title="Do you want to delete this class?"
        mainBtnName="Remove"
        onChange={handleDeleteDialogChange}
      >
        <Typography variant="subtitle1">
          This action will take the removing all info related to current class.
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

export default ClassEdit;
