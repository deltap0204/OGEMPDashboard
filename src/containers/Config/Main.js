import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useMutation } from '@apollo/client';
import { MainPanel } from '@app/components/Panels';
import { faTools } from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
// import { useQuery } from '@apollo/client';
import { CustomDialog, CustomInput } from '@app/components/Custom';
import { getNotificationOpt } from '@app/constants/Notifications';
// import { ToggleButton } from '@material-ui/lab';
import graphql from '@app/graphql';
import * as globalStyles from '@app/constants/globalStyles';

const ConfigMain = ({ selectedDocId, variables, resources, onChange }) => {
  const classes = globalStyles.globaluseStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [openCreate, setOpenCreate] = useState(false);
  const [newElName, setNewElName] = useState('');
  const [activeID, setActiveID] = useState();
  const [createDialogSetting, setCreateDialogSetting] = useState({});

  useEffect(() => {
    setCreateDialogSetting({
      error: false,
      helpText: 'Please input the material name'
    });
  }, []);

  useEffect(() => {
    const activeStates = resources?.filter((item) => item.state === 'active');
    if (activeStates?.length && !activeID) {
      setActiveID(activeStates[0]._id);
    }
  }, [resources]);

  const [createGrouping] = useMutation(graphql.mutations.createGrouping);

  // const [updateGroupingState] = useMutation(
  //   graphql.mutations.updateGroupingState
  // );

  const handleCreateDialogChange = async (type, value) => {
    try {
      if (type === 'input') {
        setNewElName(value);
        setCreateDialogSetting({
          error: false,
          helpText: 'Please input the configuration name'
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
          const notiOps = getNotificationOpt('config', 'success', 'create');
          enqueueSnackbar(notiOps.message, notiOps.options);
        }
        setOpenCreate(false);
        setNewElName('');
      }
    } catch (error) {
      setCreateDialogSetting({
        error: true,
        helpText: 'Current config already exist!'
      });
      const notiOps = getNotificationOpt('config', 'error', 'create');
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
      title="Configs"
      icon={faTools}
      showAddBtn
      onChange={handleMainPanelChange}
    >
      <List className={classes.elementList}>
        {resources &&
          resources.map((el) => {
            return (
              <ListItem
                key={el['_id']}
                onClick={() => handleElClicked('single', el)}
                onDoubleClick={() => handleElClicked('double', el)}
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
            );
          })}
      </List>
      <CustomDialog
        mainBtnName="Create"
        open={openCreate}
        title="Create a new configuration"
        onChange={handleCreateDialogChange}
      >
        <CustomInput
          my={2}
          size="small"
          type="text"
          label="Enter the config name"
          value={newElName}
          onChange={(value) => handleCreateDialogChange('input', value)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleCreateDialogChange('btnClick', event.target.value);
            }
          }}
          error={createDialogSetting.error}
          helperText={createDialogSetting.helpText}
          variant="outlined"
          width="300px"
        />
      </CustomDialog>
    </MainPanel>
  );
};

export default ConfigMain;
