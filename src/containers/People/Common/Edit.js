import React, { useState, useEffect, useContext } from 'react';
import {
  Grid,
  Typography,
  Select,
  Button,
  InputLabel
} from '@material-ui/core';
import { useMutation } from '@apollo/client';
import AppContext from '@app/AppContext';
import { EditPanel } from '@app/components/Panels';
import {
  UserForm,
  UserRole,
  UserState,
  SingleAdminContactInfoForm,
  AdminContactInfoForm
} from '@app/components/Forms';
import { CustomDialog, CustomCheckBox } from '@app/components/Custom';
import { getNotificationOpt } from '@app/constants/Notifications';
import { useSnackbar } from 'notistack';
import graphql from '@app/graphql';
import * as globalStyles from '@app/constants/globalStyles';

const Edit = ({
  variables,
  parent,
  forceSaveDocId,
  forceSave,
  optionType,
  resources,
  setShowEdit,
  selectedData,
  setSelectedData,
  children,
  showContact,
  setWhenState,
  setIsForceSave
}) => {
  const initialData = {
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    phone_number: '',
    state: ''
  };

  const classes = globalStyles.globaluseStyles();
  const [context] = useContext(AppContext);
  const [openDelete, setOpenDelete] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [canDelete, setCanDelete] = useState(true);
  const [canUpdate, setCanUpdate] = useState(true);
  const [title, setTitle] = useState('');
  const [data, setData] = useState(initialData);
  const { enqueueSnackbar } = useSnackbar();

  const [panelSize, setPanelSize] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    if (forceSave) {
      handleEditPanelSave('save');
    }
  }, [forceSave]);

  useEffect(() => {
    if (context) {
      const { width, height } = context.containerSize;
      setPanelSize({ width: width - 300, height });
    }
  }, [context]);

  useEffect(() => {
    if (resources) {
      setTitle(resources.name);
    }
  }, [resources]);

  const [deleteDocument] = useMutation(graphql.mutations.deleteDocument, {
    update(cache) {
      const existingGroups = cache.readQuery({
        query: graphql.queries.grouping,
        variables
      });
      const { grouping } = existingGroups;
      const newData = grouping.filter(
        (el) => el['_id'] !== selectedData['_id']
      );
      cache.writeQuery({
        query: graphql.queries.grouping,
        variables,
        data: {
          grouping: newData
        }
      });
    }
  });

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

  const handleEditPanelSave = async () => {
    try {
      const descVariables = {
        id: resources['_id'],
        collectionName: 'Users',
        version: resources.docState.version,
        data,
        parent
      };

      if (forceSave) {
        descVariables['id'] = forceSaveDocId;
      }

      await updateGroupingData({
        variables: descVariables
      });

      const notiOps = getNotificationOpt(
        'people',
        'success',
        'update',
        optionType
      );
      enqueueSnackbar(notiOps.message, notiOps.options);
      setWhenState('update', false);
      if (forceSave) setIsForceSave(false);
    } catch (error) {
      console.log(error);
      const notiOps = getNotificationOpt(
        'people',
        'error',
        'update',
        optionType
      );
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  const handleDeleteDialogChange = async (type, value) => {
    try {
      if (!value) {
        setOpenDelete(false);
        return;
      }
      if (type === 'btnClick') {
        if (!checkbox && value) {
          const notiOps = getNotificationOpt('people', 'warning', 'delete');
          enqueueSnackbar(notiOps.message, notiOps.options);
          return;
        }
        if (checkbox && value) {
          await deleteDocument({
            variables: {
              id: resources['_id'],
              collectionName: 'Users'
            }
          });
          setShowEdit(false);
          const notiOps = getNotificationOpt(
            'people',
            'success',
            'delete',
            optionType
          );
          enqueueSnackbar(notiOps.message, notiOps.options);
        }
      }
    } catch (error) {
      console.log(error);
      const notiOps = getNotificationOpt(
        'people',
        'error',
        'delete',
        optionType
      );
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  const handleChange = (type) => {
    if (type === 'save') {
      if (!parent && children) {
        const notiOps = getNotificationOpt('people', 'warning', 'mandatory');
        enqueueSnackbar(notiOps.message, notiOps.options);
        return;
      }
      handleEditPanelSave();
    } else if (type === 'delete') {
      setOpenDelete(true);
    }
  };

  return (
    <EditPanel
      title={title}
      panelSize={panelSize}
      canDelete={canDelete}
      canUpdate={canUpdate}
      onChange={handleChange}
    >
      <Grid
        className={classes.formHead}
        container
        direction="row"
        alignItems="baseline"
        justify="space-between"
        style={{ margin: '10px 10px' }}
      >
        <Typography variant="subtitle2" className={classes.docId}>
          ID: {resources['_id']}
        </Typography>
        <Grid style={{ display: 'flex', marginRight: '15px' }}>
          <div>
            <UserState resources={resources} optionType={optionType} />
          </div>
          <div style={{ marginLeft: '20px' }}>
            <UserRole
              variables={variables}
              resources={resources}
              setShowEdit={setShowEdit}
              optionType={optionType}
              setSelectedData={setSelectedData}
            />
          </div>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
          {!showContact ? (
            <UserForm
              onSave={handleEditPanelSave}
              resources={resources}
              data={data}
              parent={parent}
              setData={setData}
              initialData={initialData}
              setWhenState={setWhenState}
            >
              {children}
            </UserForm>
          ) : (
            <SingleAdminContactInfoForm
              resources={resources}
              data={data}
              setData={setData}
              initialData={initialData}
              setWhenState={setWhenState}
            >
              {children}
            </SingleAdminContactInfoForm>
          )}
        </Grid>
      </Grid>
      <CustomDialog
        open={openDelete}
        title="Do you want to delete this user?"
        mainBtnName="Remove"
        onChange={handleDeleteDialogChange}
      >
        <Typography variant="subtitle1">
          This action will take the removing all info related to current user.
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

export default Edit;
