import React, { useState } from 'react';
import clsx from 'clsx';
import { useMutation } from '@apollo/client';
import { MainPanel } from '@app/components/Panels';
import { faBox } from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { CustomDialog, CustomInput } from '@app/components/Custom';
import { getNotificationOpt } from '@app/constants/Notifications';
import graphql from '@app/graphql';
import * as globalStyles from '@app/constants/globalStyles';

const PackageMain = ({
  selectedDocId,
  variables,
  resources,
  onChange,
  setSelectedDocId,
  setEditPanelData,
  setShowEdit
}) => {
  const { parent } = variables;
  const classes = globalStyles.globaluseStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [openCreate, setOpenCreate] = useState(false);
  const [newElName, setNewElName] = useState('');
  const [selectedData, setSelectedData] = useState();

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
      setSelectedDocId(createGrouping._id);
      setEditPanelData(createGrouping);
      setShowEdit(true);
      history.push(`/packages/${createGrouping._id}`);
    }
  });

  const handleCreateDialogChange = async (type, value) => {
    try {
      if (type === 'input') setNewElName(value);
      if (type === 'btnClick') {
        if (value) {
          const result = await createGrouping({
            variables: {
              ...variables,
              name: newElName
            }
          });
          const notiOps = getNotificationOpt('package', 'success', 'create');
          enqueueSnackbar(notiOps.message, notiOps.options);
          setSelectedDocId(result?.data?.createGrouping['_id']);
          setSelectedData(result?.data?.createGrouping);
          setEditPanelData(result?.data?.createGrouping);
          setShowEdit(true);
        }
        setOpenCreate(false);
        setNewElName('');
      }
    } catch (error) {
      console.log(error.message);
      const notiOps = getNotificationOpt('package', 'error', 'create');
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  const handleMainPanelChange = (value) => {
    if (value === 'create') setOpenCreate(true);
  };

  const handleElClicked = (type, value) => {
    setSelectedData(value);
    if (type === 'single') onChange('elSingleClick', value);
    if (type === 'double') onChange('elDoubleClick', value);
  };

  return (
    <MainPanel
      isMain={!parent}
      title="Packages"
      icon={faBox}
      showAddBtn
      onChange={handleMainPanelChange}
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
                  [classes.listItem]: el['_id'] !== selectedDocId,
                  [classes.listItemSelected]: el['_id'] === selectedDocId
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
                        [classes.listItemText]: el['_id'] !== selectedDocId,
                        [classes.listSelectedItemText]:
                          el['_id'] === selectedDocId
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
        title="Create a new package"
        onChange={handleCreateDialogChange}
      >
        <CustomInput
          my={2}
          size="small"
          type="text"
          label="Enter the package name"
          value={newElName}
          onChange={(value) => handleCreateDialogChange('input', value)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleCreateDialogChange('btnClick', event.target.value);
            }
          }}
          helperText="Please input the package name"
          variant="outlined"
          width="300px"
        />
      </CustomDialog>
    </MainPanel>
  );
};

export default PackageMain;
