import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useMutation, useQuery } from '@apollo/client';
import { MainPanel } from '@app/components/Panels';
import { faStoreAlt } from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import {
  CustomDialog,
  CustomInput,
  CustomSelectBox
} from '@app/components/Custom';
import { getNotificationOpt } from '@app/constants/Notifications';
import graphql from '@app/graphql';
import * as globalStyles from '@app/constants/globalStyles';

const SchoolMain = ({ selectedDocId, variables, resources, onChange }) => {
  const { parent } = variables;
  const classes = globalStyles.globaluseStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [openCreate, setOpenCreate] = useState(false);
  const [newElName, setNewElName] = useState('');
  const [createDialogSetting, setCreateDialogSetting] = useState({});

  useEffect(() => {
    setCreateDialogSetting({
      error: false,
      input: 'Please input a new school name'
    });
  }, []);

  const [createGrouping] = useMutation(graphql.mutations.createGrouping);

  const handleCreateDialogChange = async (type, value) => {
    try {
      if (type === 'input') {
        setNewElName(value);
        setCreateDialogSetting({
          error: false,
          input: 'Please input a new school name'
        });
      }
      if (type === 'btnClick') {
        if (value) {
          await createGrouping({
            variables: {
              ...variables,
              name: newElName
            }
          });
          const notiOps = getNotificationOpt('school', 'success', 'create');
          enqueueSnackbar(notiOps.message, notiOps.options);
        }
        setOpenCreate(false);
        setNewElName('');
      }
    } catch (error) {
      console.log(error.message);
      setCreateDialogSetting({
        error: true,
        input: 'Current school already exist!'
      });
      const notiOps = getNotificationOpt('school', 'error', 'create');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  const handleMainPanelChange = (value) => {
    if (value === 'create') setOpenCreate(true);
  };

  const handleElClicked = (type, value) => {
    if (type === 'single') onChange('elSingleClick', value);
  };

  return (
    <MainPanel
      isMain={!parent}
      title="Schools"
      icon={faStoreAlt}
      showAddBtn
      onChange={handleMainPanelChange}
    >
      <List className={classes.elementList}>
        {resources &&
          resources.map((el) => (
            <ListItem
              key={el['_id']}
              onClick={() => handleElClicked('single', el)}
              className={clsx(classes.listItems, {
                [classes.listItem]: el['_id'] !== selectedDocId,
                [classes.listItemSelected]: el['_id'] === selectedDocId
              })}
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
                    className={clsx({
                      [classes.listItemText]: el['_id'] !== selectedDocId,
                      [classes.listSelectedItemText]:
                        el['_id'] === selectedDocId
                    })}
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
        title="Create a new school"
        onChange={handleCreateDialogChange}
      >
        <Box width={300}>
          <CustomInput
            my={2}
            size="small"
            type="text"
            label="Enter the school name"
            value={newElName}
            style={classes.inputArea}
            onChange={(value) => handleCreateDialogChange('input', value)}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                handleCreateDialogChange('btnClick', event.target.value);
              }
            }}
            error={createDialogSetting.error}
            helperText={createDialogSetting.input}
            variant="outlined"
            width="300px"
          />
        </Box>
      </CustomDialog>
    </MainPanel>
  );
};

export default SchoolMain;
