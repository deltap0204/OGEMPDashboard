import React, { useState, useEffect, useContext } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import AppContext from '@app/AppContext';
import { EditPanel } from '@app/components/Panels';
import { CustomDialog, CustomCheckBox } from '@app/components/Custom';
import TextEditor from '@app/components/TextEditor';
import { Edit } from '@material-ui/icons';
import { getNotificationOpt } from '@app/constants/Notifications';
import graphql from '@app/graphql';
import {
  DescriptionForm,
  AttachmentForm,
  AvatarUploadForm,
  StateForm,
  StationForm,
  SchoolForm,
  DistrictForm,
  ClassForm,
  MultiTagsForm
} from '@app/components/Forms';
import { DefaultCard, DescriptionCard } from '@app/components/Cards';
import * as globalStyles from '@app/constants/globalStyles';

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

const MaterialEdit = ({
  forceSaveDocId,
  forceSave,
  forceSaveDocVersion,
  variables,
  resources,
  selectedTreeItem,
  stateResources,
  setWhenState,
  stationResources,
  schoolResources,
  districtResources,
  classResources,
  onChange
}) => {
  const classes = globalStyles.globaluseStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState('');
  const [avatarS3URL, setAvatarS3URL] = useState();
  const [descData, setDescData] = useState({});
  const [detailData, setDetailData] = useState({});
  const [topologyData, setTopologyData] = useState({});
  const [context] = useContext(AppContext);
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

  const [updateGroupingState] = useMutation(
    graphql.mutations.updateGroupingState
  );

  const [updateGroupingAssetURLs] = useMutation(
    graphql.mutations.updateGroupingAssetURLs
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
      setTitle(resources.name);
      setAvatarS3URL(resources.avatarS3URL?.url || '');
      // setIsTabReset(true);
      setAvatarS3URL(resources.avatarS3URL?.url || '');
      // setTabStatus({
      //   desc: true,
      //   topology: false,
      //   htmlEditor: false,
      //   attachment: false,
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
        district: resources.topology?.district || '',
        class: resources.topology?.class || ''
      });

      setDetailData({
        ...detailData,
        state: resources.data?.state || '',
        body: resources.data?.body || null
      });

      setCanEdit(!resources.docState?.state);
      setCanUpdate(!!resources.docState?.state);
      if (selectedTreeItem && selectedTreeItem[0]?.state == 'published') {
        setCanEdit(false);
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
        htmlEditor: false,
        attachment: false,
        categories: false,
        right: false
      });
    }

    if (value === 1) {
      setTabStatus({
        desc: false,
        topology: true,
        htmlEditor: false,
        attachment: false,
        categories: false,
        right: false
      });
    }

    if (value === 2) {
      setTabStatus({
        desc: false,
        topology: false,
        htmlEditor: true,
        attachment: false,
        categories: false,
        right: false
      });
    }

    if (value === 3) {
      setTabStatus({
        desc: false,
        topology: false,
        htmlEditor: false,
        attachment: true,
        categories: false,
        right: false
      });
    }

    if (value === 4) {
      setTabStatus({
        desc: false,
        topology: false,
        htmlEditor: false,
        attachment: false,
        categories: true,
        right: false
      });
    }

    if (value === 5) {
      setTabStatus({
        desc: false,
        topology: false,
        htmlEditor: false,
        attachment: false,
        categories: false,
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
    if (type === 'textEditor') {
      setDetailData({
        ...detailData,
        body: value
      });
    }

    if (type === 'imageUploader') {
      setDetailData({
        ...detailData,
        body: value
      });
    }

    if (
      type === 'station' ||
      type === 'state' ||
      type === 'school' ||
      type === 'district' ||
      type === 'class'
    ) {
      setTopologyData({
        ...topologyData,
        [type]: value
      });
    }

    setCanUpdate(true);
    onChange('update', true);
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
      if (type === 'edit') {
        setWhenState(true);
        await updateGroupingDocState({
          variables: {
            id: resources['_id'],
            collectionName: 'Classes',
            version: resources.docState.version,
            state: 'locked'
          }
        });
        setCanUpdate(true);
      }
      if (type === 'delete') setOpenDelete(true);
      if (type === 'save') {
        setWhenState(false);
        let varaibleData = {
          id: resources['_id'],
          collectionName: 'Classes',
          version: resources.docState.version,
          title: descData ? descData.title : '',
          short: descData ? descData.short : '',
          long: descData ? descData.long : ''
        };

        let topologyVariableData = {
          id: resources['_id'],
          collectionName: 'Classes',
          version: resources.docState.version + 1,
          topology: topologyData
        };

        let avatarVariableData = {
          id: resources['_id'],
          collectionName: 'Topologies',
          version: resources.docState.version + 2,
          type: 'state',
          url: avatarS3URL
        };

        let detailVariableData = {
          id: resources['_id'],
          collectionName: 'Classes',
          version: resources.docState.version + 3,
          data: detailData
        };

        if (forceSave) {
          varaibleData = {
            ...varaibleData,
            version: forceSaveDocVersion,
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

          detailVariableData = {
            ...detailVariableData,
            id: forceSaveDocId
          };
        }

        await updateGroupingDesc({
          variables: varaibleData
        });

        await updateGroupingTopology({
          variables: topologyVariableData
        });

        await updateGroupingAvatarUrl({
          variables: avatarVariableData
        });

        await updateGroupingData({
          variables: detailVariableData
        });

        setCanUpdate(false);
        onChange('update', false);
        const notiOps = getNotificationOpt('material', 'success', 'update');
        enqueueSnackbar(notiOps.message, notiOps.options);
        if (forceSave) onChange('forceSave', false);
      }

      if (type === 'publish') {
        if (resources.state === 'published') {
          enqueueSnackbar('This material already published', {
            variant: 'warning'
          });
          return;
        }
        await updateGroupingState({
          variables: {
            id: resources['_id'],
            version: resources.docState.version,
            collectionName: 'Classes',
            state: 'published'
          }
        });
        const notiOps = getNotificationOpt('material', 'success', 'publish');
        enqueueSnackbar(notiOps.message, notiOps.options);
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt('material', 'error', 'update');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  const handleDeleteDialogChange = async (type, value) => {
    try {
      if (type === 'btnClick') {
        if (!checkbox && value) {
          const notiOps = getNotificationOpt('material', 'warning', 'delete');
          enqueueSnackbar(notiOps.message, notiOps.options);
          return;
        }

        if (checkbox && value) {
          await deleteDocument({
            variables: {
              id: resources['_id'],
              collectionName: 'Classes'
            }
          });
          const notiOps = getNotificationOpt('material', 'success', 'delete');
          enqueueSnackbar(notiOps.message, notiOps.options);
          onChange('delete');
        }

        setCheckbox(false);
        setOpenDelete(false);
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt('material', 'error', 'delete');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  return (
    <EditPanel
      title={title}
      panelSize={panelSize}
      canPublish
      canDelete
      canEdit={canEdit}
      canUpdate={canUpdate}
      tabSetting={{
        desc: true,
        topology: true,
        htmlEditor: true,
        attachment: true,
        categories: true,
        right: true
      }}
      isTabReset={isTabReset}
      onChange={handleEditPanelChange}
      onTabChnage={handleShowPanel}
      selectedTreeItem={selectedTreeItem}
    >
      <Typography variant="subtitle2" className={classes.docId}>
        ID: {resources['_id']}{' '}
        {resources.parent ? `/ Parent: ${resources.parent}` : []}{' '}
        {resources.docState.version ? `/ ${resources.docState.version}` : []}
      </Typography>

      <Grid
        spacing={2}
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

        {canUpdate
          ? tabStatus.topology &&
            (stateResources.length &&
            stationResources.length &&
            districtResources.length &&
            schoolResources.length &&
            classResources.length ? (
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
                  <DefaultCard style={classes.detailCard}>
                    <ClassForm
                      disable={!canUpdate}
                      document={resources}
                      resources={classResources}
                      customDefaultValue={topologyData?.class}
                      onChange={(value) => handleFormChange('class', value)}
                      size="small"
                    />
                  </DefaultCard>
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

                  <Grid container direction="row" alignItems="baseline">
                    <Typography gutterBottom variant="subtitle1" component="h2">
                      <b>Class:</b>
                    </Typography>
                    {topologyData?.class ? (
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        component="h2"
                        style={{ marginLeft: 5 }}
                      >
                        {
                          classResources.find(
                            (item) => item.value === topologyData?.class
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
        {tabStatus.attachment && (
          <Grid item xs={12} sm={12} md={12} lg={10}>
            <AttachmentForm
              disable={!canUpdate}
              docId={resources['_id']}
              resources={resources.assetURLs}
              onChange={handleAttFormChange}
            />
          </Grid>
        )}
        {tabStatus.categories && (
          <Grid item xs={12} sm={12} md={12} lg={10}>
            <MultiTagsForm />
          </Grid>
        )}
      </Grid>
      <CustomDialog
        open={openDelete}
        title="Do you want to delete this material?"
        mainBtnName="Remove"
        onChange={handleDeleteDialogChange}
      >
        <Typography variant="subtitle1">
          This action will take the removing all info related to current
          material.
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

export default MaterialEdit;