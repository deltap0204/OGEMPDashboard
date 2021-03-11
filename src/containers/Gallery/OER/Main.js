import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useMutation } from '@apollo/client';
import { MainPanel } from '@app/components/Panels';
import { faSchool } from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { CustomDialog, CustomInput } from '@app/components/Custom';
import { getNotificationOpt } from '@app/constants/Notifications';
import graphql from '@app/graphql';
import * as globalStyles from '@app/constants/globalStyles';

const OERMain = ({ selectedDocId, variables, resources, onChange }) => {
  const classes = globalStyles.globaluseStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [openCreate, setOpenCreate] = useState(false);
  const [createDialogSetting, setCreateDialogSetting] = useState({});
  const [newElName, setNewElName] = useState('');

  const [createGrouping] = useMutation(graphql.mutations.createGrouping);

  useEffect(() => {
    setCreateDialogSetting({
      error: false,
      helperText: 'Please enter the new OER name'
    });
  }, []);

  const handleCreateDialogChange = async (type, value) => {
    try {
      if (type === 'input') {
        setNewElName(value);
        setCreateDialogSetting({
          error: false,
          helperText: 'Please enter the new OER name'
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
          const notiOps = getNotificationOpt('oer', 'success', 'create');
          enqueueSnackbar(notiOps.message, notiOps.options);
        }
        setOpenCreate(false);
        setNewElName('');
      }
    } catch (error) {
      console.log(error.message);
      setCreateDialogSetting({
        error: true,
        helpText: 'This oer already exist!'
      });
      const notiOps = getNotificationOpt('oer', 'error', 'create');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  const handleMainPanelChange = (value) => {
    if (value === 'create') setOpenCreate(true);
  };

  const handleElClicked = (value) => {
    onChange('elSingleClick', value);
  };

  return (
    <MainPanel
      title="OER"
      icon={faSchool}
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
        title="Create a new oer"
        onChange={handleCreateDialogChange}
      >
        <CustomInput
          my={2}
          size="small"
          type="text"
          label="Enter the oer name"
          value={newElName}
          onChange={(value) => handleCreateDialogChange('input', value)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleCreateDialogChange('btnClick', event.target.value);
            }
          }}
          error={createDialogSetting.error}
          helperText={createDialogSetting.helperText}
          variant="outlined"
          width="300px"
        />
      </CustomDialog>
    </MainPanel>
  );
};

export default OERMain;
