import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useQuery, useMutation } from '@apollo/client';
import { faBroadcastTower, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button
} from '@material-ui/core';
import { getNotificationOpt } from '@app/constants/Notifications';
import { useSnackbar } from 'notistack';
import { MainPanel } from '@app/components/Panels';
import {
  CustomDialog,
  CustomInput,
  CustomCheckBox,
  CustomSelectBox
} from '@app/components/Custom';
import { Add, Delete } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import graphql from '@app/graphql';
import { UsersResource } from './data';
import * as globalStyles from '@app/constants/globalStyles';

const Main = ({
  variables,
  optionType,
  historyKey,
  resources,
  onChange,
  setEditPanelData,
  setShowEdit,
  selectedData,
  setSelectedData
}) => {
  const { parent, type } = variables;
  const classes = globalStyles.globaluseStyles();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [newElName, setNewElName] = useState('');
  const [canDelete, setCanDelete] = useState(false);

  const [createDialogSetting, setCreateDialogSetting] = useState({
    title: '',
    subtitle: '',
    helperText: ''
  });
  const [deleteDialogSetting, setDeleteDialogSetting] = useState({
    title: '',
    content: '',
    checkbox: ''
  });

  useEffect(() => {
    if (!parent) {
      setCreateDialogSetting({
        ...createDialogSetting,
        title: 'Create a new user',
        subtitle: 'Enter User name',
        helperText: 'Please input the username.'
      });

      setDeleteDialogSetting({
        ...deleteDialogSetting,
        title: 'Do you want to delete this user?',
        content: `This action will take the removing
          all info related to current user.`,
        checkbox: 'I agree with this action. '
      });
    }
  }, [parent]);

  const [createGrouping] = useMutation(graphql.mutations.createGrouping, {
    update(cache, { data: { createGrouping } }) {
      const existingGroups = cache.readQuery({
        query: graphql.queries.grouping,
        variables
      });
      const { grouping } = existingGroups;
      const newData = grouping
        ? [...grouping, createGrouping]
        : [createGrouping];

      cache.writeQuery({
        query: graphql.queries.grouping,
        variables,
        data: {
          grouping: newData
        }
      });
      setSelectedData(createGrouping);
      setEditPanelData(createGrouping);
      setShowEdit(true);
    }
  });

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

  const handleMainPanelChange = (value) => {
    if (value === 'create') setOpenCreate(true);
    if (value === 'delete') setOpenDelete(true);
  };

  const handleElClicked = (type, value) => {
    setSelectedData(value);
    if (type === 'single') {
      onChange('elSingleClick', value);
    }

    if (type === 'double') {
      onChange('elDoubleClick', value);
    }
  };

  const handleCreateDialogChange = async (type, value) => {
    try {
      if (type === 'input') setNewElName(value);
      if (type === 'btnClick') {
        if (value) {
          await createGrouping({
            variables: {
              ...variables,
              name: newElName
            }
          });
          const notiOps = getNotificationOpt(
            'people',
            'success',
            'create',
            optionType
          );
          enqueueSnackbar(notiOps.message, notiOps.options);
        }

        setOpenCreate(false);
        setNewElName('');
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt(
        'people',
        'error',
        'create',
        optionType
      );
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };
  const handleDeleteDialogChange = async (type, value) => {
    try {
      if (type === 'checkbox') setCanDelete(true);
      if (type === 'btnClick') {
        if (value && canDelete && selectedData) {
          await deleteDocument({
            variables: {
              collectionName: 'Users',
              id: selectedData['_id']
            }
          });
          const notiOps = getNotificationOpt(
            'people',
            'success',
            'delete',
            optionType
          );
          enqueueSnackbar(notiOps.message, notiOps.options);
          onChange('delete');
        }

        setOpenDelete(false);
        setSelectedData();
        setCanDelete(false);
      }
    } catch (error) {
      const notiOps = getNotificationOpt(
        'people',
        'error',
        'delete',
        optionType
      );
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  const handleTypeChange = (selected) => {
    history.push(`/peoples/${selected.urlKey}`);
  };

  return (
    <>
      <MainPanel
        isMain={!parent}
        icon={faUserAlt}
        showAddBtn
        onChange={handleMainPanelChange}
        extraComponent={
          <CustomSelectBox
            id="class-types"
            value={type}
            variant="outlined"
            resources={UsersResource}
            style={classes.selectBox}
            customStyle={{
              maxHeight: 28,
              maxWidth: 220,
              marginTop: 0,
              marginBottom: 2
            }}
            onChange={handleTypeChange}
          />
        }
      >
        <List className={classes.elementList}>
          {resources &&
            resources.map((el) => (
              <ListItem
                key={el['_id']}
                onClick={() => handleElClicked('single', el)}
                onDoubleClick={() => handleElClicked('double', el)}
                className={clsx(
                  classes.listItems,
                  selectedData && {
                    [classes.listItem]: el['_id'] !== selectedData['_id'],
                    [classes.listItemSelected]:
                      el['_id'] === selectedData['_id']
                  }
                )}
              >
                <ListItemText className={classes.listItemText}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    component={Typography}
                    variant="subtitle1"
                  >
                    <span
                      className={clsx(
                        selectedData && {
                          [classes.listItemText]:
                            el['_id'] !== selectedData['_id'],
                          [classes.listSelectedItemText]:
                            el['_id'] === selectedData['_id']
                        }
                      )}
                    >
                      {el.name}
                    </span>
                  </Box>
                </ListItemText>
              </ListItem>
            ))}
        </List>
        <CustomDialog
          mainBtnName="Create"
          open={openCreate}
          title={createDialogSetting.title}
          onChange={handleCreateDialogChange}
        >
          <CustomInput
            my={2}
            size="small"
            label={createDialogSetting.subtitle}
            variant="outlined"
            value={newElName}
            onChange={(value) => handleCreateDialogChange('input', value)}
            helperText={createDialogSetting.helperText}
            width="300px"
          />
        </CustomDialog>
        <CustomDialog
          open={openDelete}
          title="Remove Classroom"
          mainBtnName="Remove"
          onChange={handleDeleteDialogChange}
        >
          <Typography variant="subtitle1">
            {deleteDialogSetting.content}
          </Typography>
          <CustomCheckBox
            color="primary"
            value={canDelete}
            label={deleteDialogSetting.checkbox}
            onChange={(value) => handleDeleteDialogChange('checkbox', value)}
          />
        </CustomDialog>
      </MainPanel>
    </>
  );
};

export default Main;
