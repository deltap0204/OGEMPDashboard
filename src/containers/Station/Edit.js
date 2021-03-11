/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { Grid, Typography } from '@material-ui/core';
import AppContext from '@app/AppContext';
import { useMutation } from '@apollo/client';
import { EditPanel } from '@app/components/Panels';
import {
  DescriptionForm,
  StateForm,
  AvatarUploadForm,
  AdminContactInfoForm
} from '@app/components/Forms';
import { Edit } from '@material-ui/icons';
import { getNotificationOpt } from '@app/constants/Notifications';
import { useSnackbar } from 'notistack';
import graphql from '@app/graphql';
import { CustomDialog, CustomCheckBox } from '@app/components/Custom';
import { DefaultCard, DescriptionCard } from '@app/components/Cards';
import * as globalStyles from '@app/constants/globalStyles';

const roleOptions = [
  { label: 'Station Administrator', value: 'station-admin' },
  { label: 'General', value: 'general' }
];

const NoneSelected = () => {
  return (
    <>
      <Typography
        gutterBottom
        variant="subtitle1"
        component="h2"
        style={{ marginLeft: 5 }}
      >
        Null
      </Typography>
    </>
  );
};

const StationEdit = ({
  forceSaveDocId,
  forceSave,
  variables,
  resources,
  stateResources,
  setWhenState,
  onChange
}) => {
  const classes = globalStyles.globaluseStyles();
  const [context] = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState('');
  const [avatarS3URL, setAvatarS3URL] = useState();
  const [descData, setDescData] = useState({});
  const [topologyData, setTopologyData] = useState({});
  const [detailData, setDetailData] = useState({});
  const [canEdit, setCanEdit] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [panelSize, setPanelSize] = useState({
    width: 0,
    height: 0
  });
  const [isTabReset, setIsTabReset] = useState(false);
  const [tabStatus, setTabStatus] = useState({});
  const [currentTab, setCurrentTab] = useState(0);
  const [contactData, setContactData] = useState();

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
        state: resources.topology?.state || ''
      });

      setDetailData({
        ...detailData,
        state: resources.data?.state || ''
      });

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
    }

    if (value === 1) {
      setTabStatus({
        desc: false,
        topology: true,
        people: false,
        right: false
      });
    }

    if (value === 2) {
      setTabStatus({
        desc: false,
        topology: false,
        people: true,
        right: false
      });
    }

    if (value === 3) {
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
    if (type === 'state') {
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
        let varaibleData = {
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
          url: avatarS3URL
        };

        if (forceSave) {
          varaibleData = {
            ...varaibleData,
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
          variables: varaibleData
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
        setWhenState(false);
        const notiOps = getNotificationOpt('station', 'success', 'update');
        enqueueSnackbar(notiOps.message, notiOps.options);
        setCanUpdate(false);
        onChange('update', false);
        if (forceSave) onChange('forceSave', false);
      } else if (type === 'delete') {
        setOpenDelete(true);
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt('station', 'error', 'update');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  const handleDeleteDialogChange = async (type, value) => {
    try {
      if (type === 'btnClick') {
        if (!checkbox && value) {
          const notiOps = getNotificationOpt('station', 'warning', 'delete');
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
          const notiOps = getNotificationOpt('station', 'success', 'delete');
          enqueueSnackbar(notiOps.message, notiOps.options);
          onChange('delete', false);
        }
        setCheckbox(false);
        setOpenDelete(false);
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt('station', 'error', 'delete');
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
        container
        spacing={0}
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

        {canUpdate
          ? tabStatus.topology &&
            (stateResources?.length ? (
              <Grid item xs={12} sm={12} md={12} lg={10}>
                <DefaultCard style={classes.detailCard}>
                  <StateForm
                    disable={!canUpdate}
                    document={resources}
                    resources={stateResources}
                    customDefaultValue={topologyData?.state}
                    onChange={(value) => handleFormChange('state', value)}
                    size="small"
                  />
                </DefaultCard>
              </Grid>
            ) : (
              <DescriptionCard>
                <Typography
                  gutterBottom
                  variant="h5"
                  color="textSecondary"
                  component="h2"
                >
                  Please add a state from the state menu first.
                </Typography>
              </DescriptionCard>
            ))
          : tabStatus.topology && (
              <>
                <DescriptionCard title={topologyData?.state}>
                  <Grid container direction="row" alignItems="baseline">
                    <Typography gutterBottom variant="subtitle1">
                      <b>State:</b>
                    </Typography>
                    {topologyData?.state ? (
                      <>
                        <Typography
                          gutterBottom
                          variant="subtitle1"
                          component="h2"
                          style={{ marginLeft: 5 }}
                        >
                          {
                            stateResources.find(
                              (item) => item.value === topologyData?.state
                            )?.label
                          }
                        </Typography>
                      </>
                    ) : (
                      <NoneSelected />
                    )}
                  </Grid>
                </DescriptionCard>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                  component="h2"
                  style={{ marginTop: 5 }}
                >
                  * press <Edit fontSize="small" /> to enter values
                </Typography>
              </>
            )}

        {tabStatus.people && (
          <Grid item xs={12} sm={12} md={12} lg={10}>
            <AdminContactInfoForm
              docType="station-admin"
              resources={resources}
              setCanUpdate={setCanUpdate}
            />
          </Grid>
        )}
      </Grid>
      <CustomDialog
        open={openDelete}
        title="Do you want to delete this station?"
        mainBtnName="Remove"
        onChange={handleDeleteDialogChange}
      >
        <Typography variant="subtitle1">
          This action will take the removing all info related to current
          station.
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

export default StationEdit;
