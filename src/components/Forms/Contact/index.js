import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Divider,
  Typography,
  TextField,
  Button
} from '@material-ui/core';
import { Add, Delete } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';
import { DefaultCard } from '@app/components/Cards';
import CloseIcon from '@material-ui/icons/Close';
import useStyles from './style';

const ContactForm = ({ resources }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState([]);
  const handleInputChange = (type, event, index) => {};

  const handleAddContact = () => {
    setFormData([
      ...formData,
      {
        role: '',
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        phone: '',
        sms: ''
      }
    ]);
  };

  const handleDelete = (value) => {
    const tmp = formData.filter((el, index) => index !== value);
    setFormData(tmp);
  };

  return (
    <DefaultCard className={classes.root}>
      <Box
        className={classes.header}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6">
          <FontAwesomeIcon icon={faIdCard} className={classes.icon} />
          Contact Information
        </Typography>
      </Box>
      <Divider className={classes.separator} />
      <main className={classes.content}>
        {formData &&
          formData.map((el, index) => (
            <div key={index} className={classes.elContactInfo}>
              <Grid container spacing={2} direction="row">
                <Grid item xs={12} className={classes.toolbar}>
                  Contact Info #{index + 1}
                  <Button size="small" onClick={() => handleDelete(index)}>
                    <CloseIcon />
                  </Button>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
              >
                <Grid item xs={6}>
                  <Box
                    className={classes.inputArea}
                    component={TextField}
                    value={el.role}
                    onChange={(e) => handleInputChange('title', e, index)}
                    label="Role"
                    variant="outlined"
                    size="small"
                  />
                  <Box
                    className={classes.inputArea}
                    component={TextField}
                    value={el.firstName}
                    onChange={(e) => handleInputChange('firstName', e, index)}
                    label="First Name"
                    variant="outlined"
                    size="small"
                  />
                  <Box
                    className={classes.inputArea}
                    component={TextField}
                    value={el.lastName}
                    onChange={(e) => handleInputChange('lastName', e, index)}
                    label="Last Name"
                    variant="outlined"
                    size="small"
                  />
                  <Box
                    className={classes.inputArea}
                    component={TextField}
                    value={el.address}
                    onChange={(e) => handleInputChange('address', e, index)}
                    label="Address"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Box
                    className={classes.inputArea}
                    component={TextField}
                    value={el.email}
                    onChange={(e) => handleInputChange('email', e, index)}
                    label="Email"
                    variant="outlined"
                    size="small"
                  />
                  <Box
                    className={classes.inputArea}
                    component={TextField}
                    value={el.phone}
                    onChange={(e) => handleInputChange('phone', e, index)}
                    label="Phone"
                    variant="outlined"
                    size="small"
                  />
                  <Box
                    className={classes.inputArea}
                    component={TextField}
                    value={el.sms}
                    onChange={(e) => handleInputChange('sms', e, index)}
                    label="SMS"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              </Grid>
            </div>
          ))}
      </main>
      <Box display="flex" justifyContent="center">
        <Button
          variant="contained"
          className={classes.btnAdd}
          color="primary"
          onClick={handleAddContact}
        >
          <Add />
          Add Another Contact
        </Button>
      </Box>
    </DefaultCard>
  );
};

export default ContactForm;
