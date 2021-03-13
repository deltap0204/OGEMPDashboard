import React, { useState, useEffect, useContext } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import graphql from '@app/graphql';
import { DefaultCard } from '@app/components/Cards';
import ImageUploader from '@app/components/ImageUploader';
import {
  CustomInput,
  CustomSelectBox,
  CustomNumberInput,
  CustomTextArea,
  CustomDialog
} from '@app/components/Custom';
import { AvatarUploadForm } from '@app/components/Forms';
import { getNotificationOpt } from '@app/constants/Notifications';
import useStyles from './style';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Collapse,
  Typography,
  MenuItem,
  Menu
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import AppContext from '@app/AppContext';
import { LoadingCard } from '@app/components/Cards';
import {
  Add,
  Save as SaveIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@material-ui/icons';

const options = ['Archived', 'Active', 'Inactive'];
const optionsColor = {
  archived: 'Orange',
  active: 'Green',
  inactive: 'Red'
};

const roleOptions = [
  { label: 'Station Administrator', value: 'station-admin' },
  { label: 'General', value: 'general' }
];

const AdminContactInfoForm = ({
  docType,
  resources,
  onChange,
  setCanUpdate
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loadedData, setLoadedData] = useState([]);
  const [newElName, setNewElName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState();
  const [createDialogSetting, setCreateDialogSetting] = useState({});
  const [openCreate, setOpenCreate] = useState(false);
  const [clicked, setClicked] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [appContext, setAppContext] = useContext(AppContext);

  const variables = {
    collectionName: 'Users',
    type: docType,
    state: 'active',
    parent: resources['_id'],
    name: null
  };

  const [createUser] = useMutation(graphql.mutations.createUser);
  const [updateUser] = useMutation(graphql.mutations.updateUser);
  const [deleteUser] = useMutation(graphql.mutations.deleteUser);

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

      if (appContext.userUpdate) {
        if (appContext.userUpdate.type === docType) {
          setLoadedData([...loadedData]);

          setAppContext({
            ...appContext,
            userUpdate: null
          });
        }
      }
    }
  }, [appContext]);

  const handleFormChange = (index, type, value) => {
    let items = [...loadedData];
    items[index] = {
      ...items[index],
      [type]: value
    };
    setLoadedData(items);
  };

  const handleAddContact = () => {
    setOpenCreate(true);
  };

  const handleInputChange = (index, type, value) => {
    let items = [...loadedData];
    let item = { ...items[index].data };

    item[type] = value;
    items[index] = { ...items[index], data: item };
    setLoadedData(items);
  };

  const handleIconClick = (index) => {
    if (selectedItem == index) {
      setClicked((prev) => !prev);
    } else {
      setClicked(true);
    }
    setSelectedItem(index);
  };

  const handleClickListItem = (event, index) => {
    setAnchorEl({ [index]: event.currentTarget });
    // setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (index, type, optionIndex) => {
    let items = [...loadedData];
    items[index] = {
      ...items[index],
      [type]: options[optionIndex].toLowerCase()
    };
    setLoadedData(items);

    setSelectedIndex(optionIndex);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateDialogChange = async (type, value) => {
    try {
      if (type === 'input') setNewElName(value);
      if (type === 'phone') setNewPhoneNumber(value);
      if (type === 'btnClick') {
        if (value) {
          await createUser({
            variables: {
              collectionName: 'Users',
              name: newElName,
              phone: '+1' + newPhoneNumber,
              type: docType,
              state: 'active',
              parent: resources['_id']
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
      const notiOps = getNotificationOpt(
        'people',
        'error',
        'create',
        'station'
      );
      enqueueSnackbar(notiOps.message, notiOps.options);
    }
  };

  const handleContactChange = async (type, value) => {
    try {
      if (type === 'save') {
        let contactData = {
          name: value.name,
          collectionName: 'Users',
          version: value.docState.version + 1,
          data: value.data,
          state: value.state,
          url: value.avatarS3URL
        };
        console.log('contactData:', contactData);
        await updateUser({
          variables: contactData
        });

        const notiOps = getNotificationOpt(
          'people',
          'success',
          'update',
          'station'
        );
        enqueueSnackbar(notiOps.message, notiOps.options);
        setCanUpdate(false);
        // onChange('update', false);
      }
      if (type === 'delete') {
        await deleteUser({
          variables: {
            name: value,
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
        loadedData.map((el, index) => (
          <>
            <DefaultCard style={classes.contactCard} px={1}>
              <Grid
                container
                spacing={1}
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
              >
                <Grid
                  container
                  spacing={1}
                  justify="flex-start"
                  alignItems="flex-start"
                  style={{ display: 'block', marginBottom: '5px' }}
                >
                  <Typography variant="subtitle2" className={classes.docId}>
                    ID: {el['_id']} {el.parent ? `/ Parent: ${el.parent}` : []}{' '}
                    {el.docState.version ? `/ ${el.docState.version}` : []}
                  </Typography>
                  <Box className={classes.iconBtns}>
                    <IconButton aria-label="delete" className={classes.iconBtn}>
                      <SaveIcon
                        fontSize="inherit"
                        onClick={() => handleContactChange('save', el)}
                      />
                    </IconButton>
                    <IconButton aria-label="delete" className={classes.iconBtn}>
                      <DeleteIcon
                        fontSize="inherit"
                        onClick={() =>
                          handleContactChange('delete', el['name'])
                        }
                      />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid
                  container
                  spacing={1}
                  direction="row"
                  justify="flex-start"
                  alignItems="flex-start"
                >
                  <Grid item xs={12} sm={12} md={12} lg={2} mt={1}>
                    <Box style={{ marginTop: 4 }}>
                      <AvatarUploadForm
                        resources={el.avatarS3URL}
                        docId={el['_id']}
                        acceptedFiles={['image/png']}
                        onChange={(value) =>
                          handleFormChange(index, 'avatarS3URL', value)
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={10}>
                    <Grid
                      container
                      spacing={1}
                      justify="flex-start"
                      alignItems="flex-start"
                    >
                      <Grid item xs={12} sm={12} md={12} lg={4}>
                        <CustomInput
                          label="First Name"
                          variant="outlined"
                          size="small"
                          name="firstname"
                          value={el.data?.firstName}
                          style={classes.inputArea}
                          onChange={(value) =>
                            handleInputChange(index, 'firstName', value)
                          }
                        />
                        <CustomInput
                          label="Last Name"
                          variant="outlined"
                          size="small"
                          name="lastName"
                          value={el.data?.lastName}
                          style={classes.inputArea}
                          onChange={(value) =>
                            handleInputChange(index, 'lastName', value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={4}>
                        <CustomNumberInput
                          label="Phone Number"
                          variant="outlined"
                          size="small"
                          name="phone"
                          value={el.data?.phone}
                          style={classes.inputArea}
                          onChange={(value) =>
                            handleInputChange(index, 'phone', value)
                          }
                        />
                        <CustomInput
                          label="SMS"
                          variant="outlined"
                          size="small"
                          name="sms"
                          value={el.data?.sms}
                          style={classes.inputArea}
                          onChange={(value) =>
                            handleInputChange(index, 'sms', value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={4}>
                        <CustomSelectBox
                          id="admin-card-role"
                          label="Role"
                          variant="outlined"
                          value={el.data?.role}
                          defaultValue={''}
                          style={classes.selectBox}
                          resources={roleOptions}
                          onChange={(value) =>
                            handleInputChange(index, 'role', value.value)
                          }
                          size="small"
                        />
                        <div className={classes.docName}>
                          <Button
                            name={`state${index}`}
                            variant="contained"
                            className={classes.listBtn}
                            onClick={(e) => handleClickListItem(e, index)}
                            style={{ backgroundColor: optionsColor[el.state] }}
                          >
                            {el.state}
                          </Button>
                          <Menu
                            id="lock-menu"
                            anchorEl={anchorEl && anchorEl[index]}
                            keepMounted
                            open={Boolean(anchorEl && anchorEl[index])}
                            onClose={handleClose}
                          >
                            {options.map((option, optionIndex) => (
                              <MenuItem
                                key={option}
                                selected={optionIndex === selectedIndex}
                                onClick={() =>
                                  handleMenuItemClick(
                                    index,
                                    'state',
                                    optionIndex
                                  )
                                }
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </Menu>
                        </div>
                        {/* <IconButton
                        aria-label="status"
                        className={classes.margin}
                        size="medium"
                      >
                        {resources.state === 'active' && (
                          <ArrowUpwardIcon fontSize="inherit" />
                        )}
                        {!resources?.state && (
                          <ArrowDownwardIcon fontSize="inherit" />
                        )}
                      </IconButton> */}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <IconButton
                      onClick={() => handleIconClick(index)}
                      style={{ padding: 0, float: 'right', marginTop: '-8px' }}
                    >
                      {clicked && selectedItem == index ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </DefaultCard>

            <Collapse in={clicked && selectedItem == index}>
              <DefaultCard style={classes.root} px={1}>
                {/* <IconButton
                // onClick={() => onChange('delete')}
                className={classes.actionButton}
              >
                <Delete />
              </IconButton> */}

                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justify="flex-start"
                  alignItems="flex-start"
                >
                  <Grid item xs={12} md={12} lg={12}>
                    <CustomTextArea
                      min={2}
                      max={4}
                      value={el.data?.note}
                      onChange={(value) =>
                        handleInputChange(index, 'note', value)
                      }
                      style={classes.textArea}
                    />
                  </Grid>
                </Grid>
              </DefaultCard>
            </Collapse>
          </>
        ))}
      <Box className={classes.boxBtn} display="flex" justifyContent="center">
        <Button
          variant="contained"
          className={classes.btnAdd}
          onClick={handleAddContact}
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
        <Grid item xs={12} md={12} lg={12}>
          <CustomInput
            type="text"
            label="Enter Name"
            value={newElName}
            onChange={(value) => handleCreateDialogChange('input', value)}
            error={createDialogSetting.error}
            // helperText={createDialogSetting.helperText}
            variant="outlined"
            size="small"
            width="300px"
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12} style={{ marginTop: '10px' }}>
          <CustomNumberInput
            label="Phone Number"
            variant="outlined"
            size="small"
            name="phone"
            value={newPhoneNumber}
            style={classes.inputArea}
            onChange={(value) => handleCreateDialogChange('phone', value)}
          />
        </Grid>
      </CustomDialog>
    </LoadingCard>
  );
};

export default AdminContactInfoForm;
