import React, { useState, useEffect, useContext } from 'react';
import { Box, Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useMutation, useQuery } from '@apollo/client';
import { LoadingCard } from '@app/components/Cards';
import { useSnackbar } from 'notistack';
import { CustomDialog, CustomInput } from '@app/components/Custom';
import { getNotificationOpt } from '@app/constants/Notifications';
import AppContext from '@app/AppContext';
import graphql from '@app/graphql';
import ContactInfo from './ContactInfo';
import useStyles from './style';

const AdminContactForm = ({ parentDocId, docType, roleOptions }) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();
  const [loadedData, setLoadedData] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [newElName, setNewElName] = useState('');
  const [createDialogSetting, setCreateDialogSetting] = useState({});
  const [appContext, setAppContext] = useContext(AppContext);
  const variables = {
    collectionName: 'Users',
    parent: parentDocId,
    type: docType
  };

  const [createUser] = useMutation(graphql.mutations.createUser);
  const [deleteDocument] = useMutation(graphql.mutations.deleteDocument);

  useEffect(() => {
    setCreateDialogSetting({
      error: false,
      helperText: 'Please enter the new contact name'
    });
  }, []);

  const { loading, error, data } = useQuery(graphql.queries.user, {
    variables
  });

  useEffect(() => {
    if (!loading && !error) {
      const { user } = data;
      setLoadedData(user);
    }
  }, [loading, error, data]);

  useEffect(() => {
    if (appContext) {
      if (appContext.userAdd) {
        if (appContext.userAdd.type === docType) {
          setLoadedData([...loadedData, appContext.userAdd]);

          setAppContext({
            ...appContext,
            userAdd: null
          });
        }
      }

      if (appContext.documentDelete) {
        const { _id, collectionName } = appContext.documentDelete;
        if (collectionName === 'Users') {
          const tmp = loadedData.filter((el) => el['_id'] !== _id);
          setLoadedData(tmp);
          setAppContext({
            ...appContext,
            documentDelete: null
          });
        }
      }
    }
  }, [appContext]);

  const handleCreateDialogChange = async (type, value) => {
    try {
      if (type === 'input') {
        setCreateDialogSetting({
          error: false,
          helperText: 'Please enter the new contact name'
        });
        setNewElName(value);
      }

      if (type === 'btnClick') {
        if (value) {
          await createUser({
            variables: {
              collectionName: 'Users',
              type: docType,
              state: 'active',
              parent: parentDocId,
              name: newElName
            }
          });
          const notiOps = getNotificationOpt(
            'people',
            'success',
            'create',
            'station'
          );
          enqueueSnackbar(notiOps.message, notiOps.options);
        }
        setNewElName('');
        setOpenCreate(false);
      }
    } catch (error) {
      console.log(error.message);
      setCreateDialogSetting({
        error: true,
        helperText: 'Current User name is duplicated!'
      });
    }
  };

  const handleContactChange = async (type, value) => {
    try {
      if (type === 'delete') {
        await deleteDocument({
          variables: {
            id: value,
            collectionName: 'Users'
          }
        });
        const notiOps = getNotificationOpt(
          'people',
          'success',
          'delete',
          'station'
        );
        enqueueSnackbar(notiOps.message, notiOps.options);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <LoadingCard loading={loading}>
      {!loading &&
        loadedData.map((el) => (
          <ContactInfo
            key={el['_id']}
            resources={el}
            roleOptions={roleOptions}
            onChange={handleContactChange}
          />
        ))}
      <Box className={classes.boxBtn} display="flex" justifyContent="center">
        <Button
          variant="contained"
          className={classes.btnAdd}
          onClick={() => setOpenCreate(true)}
        >
          <Add /> Add Another Contact
        </Button>
      </Box>
      <CustomDialog
        mainBtnName="Create"
        open={openCreate}
        title="Create a new Contact"
        onChange={handleCreateDialogChange}
      >
        <CustomInput
          type="text"
          label="Enter Name"
          value={newElName}
          error={createDialogSetting.error}
          helperText={createDialogSetting.helperText}
          variant="outlined"
          size="small"
          width="300px"
          onChange={(value) => handleCreateDialogChange('input', value)}
        />
      </CustomDialog>
    </LoadingCard>
  );
};

export default AdminContactForm;
