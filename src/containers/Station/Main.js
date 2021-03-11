import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useMutation } from '@apollo/client';
import { faBroadcastTower } from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { MainPanel } from '@app/components/Panels';
import { CustomDialog, CustomInput } from '@app/components/Custom';
import { getNotificationOpt } from '@app/constants/Notifications';
import graphql from '@app/graphql';
import * as globalStyles from '@app/constants/globalStyles';
import { StationError } from '@app/constants/Errors';

const StationMain = ({ selectedDocId, variables, resources, onChange }) => {
  const classes = globalStyles.globaluseStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedData, setSelectedData] = useState();
  const [openCreate, setOpenCreate] = useState(false);
  const [newElName, setNewElName] = useState('');
  const [createDialogSetting, setCreateDialogSetting] = useState({});

  useEffect(() => {
    setCreateDialogSetting({
      error: false,
      helperText: 'Please enter the new station name'
    });
  }, []);

  const [createGrouping] = useMutation(graphql.mutations.createGrouping);

  const handleMainPanelChange = (value) => {
    if (value === 'create') setOpenCreate(true);
  };

  const handleElClicked = (value) => {
    setSelectedData(value);
    onChange('elSingleClick', value);
  };

  const handleCreateDialogChange = async (type, value) => {
    try {
      if (type === 'input') {
        setNewElName(value);
        setCreateDialogSetting({
          error: false,
          helperText: 'Please enter the new station name'
        });
      }
      if (type === 'btnClick') {
        if (value) {
          const result = await createGrouping({
            variables: {
              ...variables,
              name: newElName
            }
          });
          const notiOps = getNotificationOpt('station', 'success', 'create');
          enqueueSnackbar(notiOps.message, notiOps.options);
          setSelectedData(result?.data?.createGrouping);
        }
        setOpenCreate(false);
        setNewElName('');
      }
    } catch (error) {
      console.log(error.message);
      setCreateDialogSetting({
        error: true,
        helperText: StationError.create.duplicate
      });
      const notiOps = getNotificationOpt('station', 'error', 'create');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  return (
    <MainPanel
      title="Station"
      icon={faBroadcastTower}
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
                  {el.state === 'published' && (
                    <Box className={classes.state} component={Typography}>
                      Published
                    </Box>
                  )}
                </Box>
              </ListItemText>
            </ListItem>
          ))}
      </List>
      <CustomDialog
        mainBtnName="Create"
        open={openCreate}
        title="Create a new Station"
        onChange={handleCreateDialogChange}
      >
        <CustomInput
          type="text"
          label="Enter Station ID"
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
          size="small"
          width="300px"
        />
      </CustomDialog>
    </MainPanel>
  );
};

export default StationMain;
