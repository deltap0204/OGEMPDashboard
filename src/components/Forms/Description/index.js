import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Grid, Typography } from '@material-ui/core';
import { CustomInput } from '@app/components/Custom';
import { Edit, Save } from '@material-ui/icons';
import { DefaultCard, DescriptionCard } from '@app/components/Cards';
import { TitleText, ShortText, LongText } from '@app/components/Text';
import * as globalStyles from '@app/constants/globalStyles';

const DescriptionForm = ({ disable, resources, onChange }) => {
  const classes = globalStyles.DescCardStyle();
  const [loadedData, setLoadedData] = useState({
    title: '',
    short: '',
    long: ''
  });

  const titleRef = useRef();
  const shortRef = useRef();
  const longRef = useRef();

  useEffect(() => {
    setLoadedData({
      ...loadedData,
      ...resources
    });
  }, [resources]);

  const handleInputChange = (type, value) => {
    setLoadedData({
      ...loadedData,
      [type]: value
    });
    onChange({
      ...loadedData,
      [type]: value
    });
  };

  const handleKeyDown = (e, change) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      if (e.target.name === 'title') {
        shortRef.current.focus();
      }
      if (e.target.name === 'short') {
        longRef.current.focus();
      }
      if (e.target.name === 'long') {
        titleRef.current.focus();
      }
      e.preventDefault();
    }
  };

  return (
    <React.Fragment>
      {disable ? (
        <React.Fragment>
          <DescriptionCard title={loadedData.title}>
            <TitleText heading="Title:" value={loadedData.title} />
            <ShortText heading="Short Text:" value={loadedData.short} />
            <LongText heading="Long Text:" value={loadedData.long} />
          </DescriptionCard>
          <Typography
            gutterBottom
            variant="subtitle1"
            component="h2"
            style={{ marginTop: 5 }}
          >
            Press <Edit fontSize="small" /> Button to edit above info
          </Typography>
        </React.Fragment>
      ) : (
        <Grid>
          <DefaultCard
            style={clsx({
              [classes.root]: !disable,
              [classes.preview]: disable
            })}
            px={1}
          >
            <CustomInput
              label="Title"
              variant="outlined"
              size="small"
              type="text"
              name="title"
              disabled={disable}
              inputRef={titleRef}
              style={classes.inputArea}
              resources={loadedData.title}
              onKeyDown={handleKeyDown}
              onChange={(value) => handleInputChange('title', value)}
            />
            <CustomInput
              multiline
              rows={2}
              label="Short Description"
              variant="outlined"
              size="small"
              type="text"
              name="short"
              disabled={disable}
              inputRef={shortRef}
              style={classes.inputArea}
              resources={loadedData.short}
              onKeyDown={handleKeyDown}
              onChange={(value) => handleInputChange('short', value)}
            />
            <CustomInput
              multiline
              rows={4}
              label="Long Description"
              variant="outlined"
              size="small"
              type="text"
              name="long"
              disabled={disable}
              inputRef={longRef}
              style={classes.inputArea}
              resources={loadedData.long}
              onKeyDown={handleKeyDown}
              onChange={(value) => handleInputChange('long', value)}
            />
          </DefaultCard>

          <Typography
            gutterBottom
            variant="subtitle1"
            component="h2"
            style={{
              marginTop: 5,
              marginLeft: 5,
              display: 'inline-flex',
              VerticalAlign: 'text-bottom',
              BoxSizing: 'inherit',
              alignItems: 'center'
            }}
          >
            Press{'  '}
            <Save
              fontSize="small"
              style={{
                marginRight: 2,
                marginLeft: 2
              }}
            />
            {'  '}
            to save above info
          </Typography>
        </Grid>
      )}
    </React.Fragment>
  );
};

export default DescriptionForm;
