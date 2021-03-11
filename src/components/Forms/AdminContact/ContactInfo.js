import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Accordion,
  IconButton,
  AccordionDetails
} from '@material-ui/core';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  ExpandMore as ExpandMoreIcon
} from '@material-ui/icons';
import ImageUploader from '@app/components/ImageUploader';
import {
  CustomInput,
  CustomNumberInput,
  CustomTextArea,
  CustomSelectBox
} from '@app/components/Custom';
import useStyles from './style';

import { withStyles } from '@material-ui/core/styles';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';

const ContactInfo = ({ resources, roleOptions, onChange, ...rest }) => {
  const classes = useStyles();
  const [expanded, setExpenaded] = useState(false);
  const [formData, setFormData] = useState({});
  const AccordionSummary = withStyles({
    content: {
      marginTop: 0,
      marginBottom: 0
    }
  })(MuiAccordionSummary);

  useEffect(() => {
    setFormData(resources?.data || {});
  }, []);

  const handleInputChange = (type, value) => {
    console.log(type, value);
    setFormData({
      ...formData,
      [type]: value
    });
  };

  return (
    <Accordion expanded={expanded} className={classes.contactInfo} {...rest}>
      <AccordionSummary
        className={classes.contactSummary}
        expandIcon={
          <ExpandMoreIcon
            onClick={(event) => {
              event.preventDefault();
              setExpenaded(!expanded);
            }}
          />
        }
      >
        <Grid
          container
          spacing={1}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          <Grid item xs={12} sm={12} md={12} lg={4} mt={1}>
            <Box style={{ marginTop: 4 }}>
              <ImageUploader isshadow />
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={8}>
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
                  value={formData?.firstName}
                  style={classes.inputArea}
                  onChange={(value) => handleInputChange('firstName', value)}
                />
                <CustomInput
                  label="Last Name"
                  variant="outlined"
                  size="small"
                  name="lastName"
                  value={formData?.lastName}
                  style={classes.inputArea}
                  onChange={(value) => handleInputChange('lastName', value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={4}>
                <CustomNumberInput
                  label="Phone Number"
                  variant="outlined"
                  size="small"
                  name="phone"
                  value={formData?.phone}
                  style={classes.inputArea}
                  onChange={(value) => handleInputChange('phone', value)}
                />
                <CustomInput
                  label="SMS"
                  variant="outlined"
                  size="small"
                  name="sms"
                  value={formData?.sms}
                  style={classes.inputArea}
                  onChange={(value) => handleInputChange('sms', value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={4}>
                <CustomSelectBox
                  id="admin-card-role"
                  label="Role"
                  variant="outlined"
                  value={''}
                  defaultValue={''}
                  style={classes.selectBox}
                  resources={roleOptions}
                  onChange={(value) => handleInputChange('role', value.value)}
                  size="small"
                />
                <IconButton
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
                </IconButton>
                <IconButton aria-label="delete" className={classes.margin}>
                  <SaveIcon fontSize="inherit" color="primary" />
                </IconButton>
                <IconButton aria-label="delete" className={classes.margin}>
                  <DeleteIcon
                    color="secondary"
                    fontSize="inherit"
                    onClick={() => onChange('delete', resources['_id'])}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <CustomTextArea
          min={2}
          max={4}
          style={classes.textArea}
          value={formData?.desc}
          onChange={(value) => handleInputChange('desc', value)}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default ContactInfo;
