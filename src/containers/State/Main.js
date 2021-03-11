import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useMutation } from '@apollo/client';
import { MainPanel } from '@app/components/Panels';
import { faFlagUsa } from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { CustomDialog, CustomSelectBox } from '@app/components/Custom';
import { getNotificationOpt } from '@app/constants/Notifications';
import graphql from '@app/graphql';
import USStateData from '@app/constants/states.json';
import { globaluseStyles } from '@app/constants/globalStyles';
import { StateError } from '@app/constants/Errors';

const StateMain = ({ selectedDocId, variables, resources, onChange }) => {
  const classes = globaluseStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [openCreate, setOpenCreate] = useState(false);
  const [createDialogSetting, setCreateDialogSetting] = useState({});
  const [newElName, setNewElName] = useState('');

  useEffect(() => {
    setCreateDialogSetting({
      error: false,
      helpText: 'Please choose one state'
    });
  }, []);

  const [createGrouping] = useMutation(graphql.mutations.createGrouping);

  const handleCreateDialogChange = async (type, value) => {
    try {
      if (type === 'input') {
        setNewElName(value.label);
        setCreateDialogSetting({
          error: false,
          helpText: 'Please choose one state'
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
          const notiOps = getNotificationOpt('state', 'success', 'create');
          enqueueSnackbar(notiOps.message, notiOps.options);
        }
        setOpenCreate(false);
        setNewElName('');
      }
    } catch (error) {
      console.log(error.message);
      setCreateDialogSetting({
        error: true,
        helpText: StateError.create.duplicate
      });
      const notiOps = getNotificationOpt('state', 'error', 'create');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  const handleMainPanelChange = (value) => {
    if (value === 'create') setOpenCreate(true);
  };

  const handleElClicked = (value) => {
    onChange('elClick', value);
  };

  return (
    <MainPanel
      title="States"
      icon={faFlagUsa}
      showAddBtn
      onChange={handleMainPanelChange}
    >
      <List className={classes.elementList}>
        {resources &&
          resources.map((el) => (
            <ListItem
              key={el['_id']}
              onClick={() => handleElClicked(el)}
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
        title="Add a new state"
        onChange={handleCreateDialogChange}
      >
        <CustomSelectBox
          label="States"
          id="united-states-data"
          variant="outlined"
          resources={USStateData}
          style={classes.selectBox}
          onChange={(value) => handleCreateDialogChange('input', value)}
          size="small"
          error={createDialogSetting.error}
          helperText={createDialogSetting.helpText}
        />
      </CustomDialog>
    </MainPanel>
  );
};

export default StateMain;
