import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Paper,
  Tab,
  Tabs
} from '@material-ui/core';
import { Save, Publish, Delete, Edit } from '@material-ui/icons';
import useStyles from './style';

const EditPanel = ({
  title,
  panelSize,
  canPublish,
  canUpdate,
  canEdit,
  canDelete,
  tabSetting,
  isTabReset,
  onChange,
  onTabChnage,
  children,
  selectedTreeItem
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (isTabReset) {
      setValue(0);
    }
  }, [isTabReset]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    onTabChnage(newValue);
  };

  return (
    <Box
      className={classes.root}
      width={panelSize.width}
      height={panelSize.height}
    >
      {tabSetting && (
        <Paper className={classes.sliderMenu} elevation={0}>
          <Tabs
            value={value}
            onChange={handleChange}
            classes={{
              indicator: classes.indicator
            }}
          >
            {tabSetting.desc && (
              <Tab label="Description" className={classes.tab} />
            )}
            {tabSetting.topology && (
              <Tab label="Topology" className={classes.tab} />
            )}
            {tabSetting.people && (
              <Tab label="People" className={classes.tab} />
            )}
            {tabSetting.htmlEditor && (
              <Tab label="HTML Editor" className={classes.tab} />
            )}
            {tabSetting.attachment && (
              <Tab label="Attachments" className={classes.tab} />
            )}
            {tabSetting.teachers && (
              <Tab label="Teachers" className={classes.tab} />
            )}
            {tabSetting.students && (
              <Tab label="Students" className={classes.tab} />
            )}
            {tabSetting.categories && (
              <Tab label="Categories" className={classes.tab} />
            )}
            {tabSetting.asset && <Tab label="Asset" className={classes.tab} />}
            {tabSetting.right && (
              <Tab label="Rights Management" className={classes.tab} />
            )}
          </Tabs>
        </Paper>
      )}
      <Box p={1}>
        <div className={classes.toolbar}>
          <Typography variant="subtitle1" style={{ fontWeight: 500 }}>
            {title}
          </Typography>

          <div className={classes.actionGroup}>
            {canPublish && (
              <IconButton
                className={classes.actionButton}
                onClick={() => onChange('publish')}
              >
                <Publish />
              </IconButton>
            )}
            {canUpdate ? (
              <IconButton
                onClick={() => onChange('save')}
                className={classes.actionButton}
              >
                <Save />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => onChange('edit')}
                className={classes.actionButton}
                disabled={!canEdit}
              >
                <Edit />
              </IconButton>
            )}
            {canDelete && (
              <IconButton
                onClick={() => onChange('delete')}
                className={classes.actionButton}
              >
                <Delete />
              </IconButton>
            )}
          </div>
        </div>
        <Divider className={classes.separator} />
        <main className={classes.main}>{children}</main>
      </Box>
    </Box>
  );
};

export default EditPanel;
