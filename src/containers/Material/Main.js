import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useMutation } from '@apollo/client';
import { MainPanel } from '@app/components/Panels';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import {
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import CustomTreeView from '@app/components/TreeViewPanel';

import { useSnackbar } from 'notistack';
import {
  CustomDialog,
  CustomInput,
  CustomRadioButtonsGroup
} from '@app/components/Custom';
import { getNotificationOpt } from '@app/constants/Notifications';
import graphql from '@app/graphql';
import * as globalStyles from '@app/constants/globalStyles';

const MaterialMain = ({
  selectedDocId,
  variables,
  resources,
  onChange,
  selectedTreeItem,
  setSelectedTreeItem,
  createGrouping,
  updateGroupingRename,
  classLoadedData
}) => {
  const { parent } = variables;
  const classes = globalStyles.globaluseStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [openCreate, setOpenCreate] = useState(false);
  const [openRename, setOpenRename] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);
  const [newElName, setNewElName] = useState('');
  const [subType, setSubType] = useState('document');
  const [createDialogSetting, setCreateDialogSetting] = useState({});
  const [selected, setSelected] = useState([]);
  const [expanded, setExpanded] = useState([]);
  useEffect(() => {
    setCreateDialogSetting({
      error: false,
      helpText: 'Please input the material name'
    });
  }, []);

  const handleCreateDialogChange = async (type, value) => {
    try {
      if (type === 'input') {
        setNewElName(value);
        setCreateDialogSetting({
          error: false,
          helpText: 'Please input the material name'
        });
      }

      if (type === 'btnClick') {
        let result;
        if (value) {
          if (openRename) {
            let varaibleData = {
              id: selectedTreeItem[0]?._id,
              collectionName: 'Materials',
              version: selectedTreeItem[0]?.docState.version,
              name: newElName
            };

            await updateGroupingRename({
              variables: varaibleData
            });
          } else {
            result = await createGrouping({
              variables: {
                ...variables,
                name: newElName,
                parent: selectedTreeItem[0]?._id,
                subType: subType
              }
            });
          }
          const notiOps = getNotificationOpt('package', 'success', 'create');
          enqueueSnackbar(notiOps.message, notiOps.options);
        }
        setOpenCreate(false);
        setOpenRename(false);
        setCanUpdate(false);
        onChange('update', false);
        setNewElName('');
        let newexpanded = expanded.includes(selectedTreeItem[0]?._id)
          ? expanded
          : [...expanded, selectedTreeItem[0]?._id];
        setExpanded(newexpanded);
        setSelected(result?.data?.createGrouping?._id);
        handleElClicked('single', result?.data?.createGrouping);
      }
    } catch (error) {
      console.log(error.message);
      setCreateDialogSetting({
        error: true,
        helpText: 'This material already exist!'
      });
      const notiOps = getNotificationOpt('package', 'error', 'create');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  const handleMainPanelChange = (value) => {
    if (value === 'create') setOpenCreate(true);
    if (value === 'rename') {
      let id = selectedTreeItem && selectedTreeItem[0]?._id;
      setNewElName(selectedTreeItem && selectedTreeItem[0]?.name);
      id != 'root' && setOpenRename(true);
    }
  };

  const handleElClicked = (type, value) => {
    if (type === 'single') onChange('elSingleClick', value);
  };

  return (
    <MainPanel
      isMain={!parent}
      title="Materials"
      icon={faBookOpen}
      showAddBtn
      onChange={handleMainPanelChange}
      selectedTreeItem={selectedTreeItem}
    >
      <div className={classes.elementList}>
        <CustomTreeView
          resources={resources}
          setSelectedTreeItem={setSelectedTreeItem}
          onClick={handleElClicked}
          onChange={handleMainPanelChange}
          setSelected={setSelected}
          selected={selected}
          setExpanded={setExpanded}
          expanded={expanded}
          classLoadedData={classLoadedData}
        />
      </div>
      <CustomDialog
        mainBtnName="Create"
        open={openCreate}
        title="Create a new material"
        onChange={handleCreateDialogChange}
      >
        <Grid item xs={12} sm={12} md={12} lg={10}>
          <CustomInput
            my={2}
            size="small"
            type="text"
            label="Enter the material name"
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
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={10}>
          <CustomRadioButtonsGroup
            setSubType={setSubType}
            selectedTreeItem={selectedTreeItem}
          />
        </Grid>
      </CustomDialog>
      <CustomDialog
        mainBtnName="Rename"
        open={openRename}
        title="Rename Material"
        onChange={handleCreateDialogChange}
      >
        <Grid item xs={12} sm={12} md={12} lg={10}>
          <CustomInput
            my={2}
            size="small"
            type="text"
            label="Enter the material name"
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
        </Grid>
      </CustomDialog>
    </MainPanel>
  );
};

export default MaterialMain;
