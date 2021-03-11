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
import { CustomDialog, CustomCheckBox } from '@app/components/Custom';
import { getNotificationOpt } from '@app/constants/Notifications';
import graphql from '@app/graphql';
import * as globalStyles from '@app/constants/globalStyles';
import { DefaultCard, DescriptionCard } from '@app/components/Cards';

const NoneSelected = () => {
  return (
    <>
      <Typography
        gutterBottom
        variant="subtitle1"
        component="h2"
        style={{ marginLeft: 5 }}
      >
        None Selected *
      </Typography>
    </>
  );
};

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
        people: false,
        right: false
      });
    }

    if (value === 1) {
      setTabStatus({
        desc: false,
        topology: true,
        teachers: true,
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
            collectionName: 'Topologies',
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
          collectionName: 'Topologies',
          version: resources.docState.version,
          title: descData ? descData.title : '',
          short: descData ? descData.short : '',
          long: descData ? descData.long : ''
        };

        let detailVariableData = {
          id: docId,
          collectionName: 'Topology',
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
              collectionName: 'Topologies'
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
            (stateResources.length &&
            stationResources.length &&
            districtResources.length &&
            schoolResources.length ? (
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
                <DefaultCard style={classes.detailCard}>
                  <StationForm
                    disable={!canUpdate}
                    document={resources}
                    resources={stationResources}
                    customDefaultValue={topologyData?.station}
                    onChange={(value) => handleFormChange('station', value)}
                    size="small"
                  />
                </DefaultCard>
                <DefaultCard style={classes.detailCard}>
                  <DistrictForm
                    disable={!canUpdate}
                    document={resources}
                    resources={districtResources}
                    customDefaultValue={topologyData?.district}
                    onChange={(value) => handleFormChange('district', value)}
                    size="small"
                  />
                </DefaultCard>
                <DefaultCard style={classes.detailCard}>
                  <SchoolForm
                    disable={!canUpdate}
                    document={resources}
                    resources={schoolResources}
                    customDefaultValue={topologyData?.school}
                    onChange={(value) => handleFormChange('school', value)}
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
                  Please add state, district, school and station first , from
                  the state, district, school and station menu.
                </Typography>
              </DescriptionCard>
            ))
          : tabStatus.topology && (
              <>
                <DescriptionCard title="class">
                  <Grid container direction="row" alignItems="baseline">
                    <Typography gutterBottom variant="subtitle1" component="h2">
                      <b>State:</b>
                    </Typography>

                    {topologyData?.state ? (
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
                    ) : (
                      <NoneSelected />
                    )}
                  </Grid>
                  <Grid container direction="row" alignItems="baseline">
                    <Typography gutterBottom variant="subtitle1" component="h2">
                      <b>Station:</b>
                    </Typography>
                    {topologyData?.station ? (
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        component="h2"
                        style={{ marginLeft: 5 }}
                      >
                        {
                          stationResources.find(
                            (item) => item.value === topologyData?.station
                          )?.label
                        }
                      </Typography>
                    ) : (
                      <NoneSelected />
                    )}
                  </Grid>

                  <Grid container direction="row" alignItems="baseline">
                    <Typography gutterBottom variant="subtitle1" component="h2">
                      <b>District:</b>
                    </Typography>
                    {topologyData?.district ? (
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        component="h2"
                        style={{ marginLeft: 5 }}
                      >
                        {
                          districtResources.find(
                            (item) => item.value === topologyData?.district
                          )?.label
                        }
                      </Typography>
                    ) : (
                      <NoneSelected />
                    )}
                  </Grid>

                  <Grid container direction="row" alignItems="baseline">
                    <Typography gutterBottom variant="subtitle1" component="h2">
                      <b>School:</b>
                    </Typography>
                    {topologyData?.school ? (
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        component="h2"
                        style={{ marginLeft: 5 }}
                      >
                        {
                          schoolResources.find(
                            (item) => item.value === topologyData?.school
                          )?.label
                        }
                      </Typography>
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
            <ContactForm />
          </Grid>
        )}
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
