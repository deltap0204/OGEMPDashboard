import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Divider } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AppContext from '@app/AppContext';
import useStyles from './style';

const MainPanel = ({
  icon,
  title,
  showAddBtn,
  onChange,
  children,
  extraComponent,
  selectedTreeItem
}) => {
  const classes = useStyles();
  const [context] = useContext(AppContext);
  const [panelSize, setPanelSize] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    if (context) {
      const { width, height } = context.containerSize;
      setPanelSize({ width: width - 350, height });
    }
  }, [context]);

  return (
    <Box className={classes.root} height={panelSize.height}>
      <div className={classes.toolbar}>
        <div style={{ width: '10%' }}>
          <FontAwesomeIcon
            icon={icon}
            size="lg"
            style={{ marginRight: '15px' }}
          />
        </div>
        <div>
          <Typography variant="h6" style={{ fontWeight: 500 }}>
            {title}
          </Typography>
        </div>
        {extraComponent}
        {showAddBtn && (
          <div className={classes.menu}>
            <FontAwesomeIcon
              icon={faPlus}
              size="lg"
              onClick={() =>
                selectedTreeItem && selectedTreeItem[0]?.subType == 'document'
                  ? onChange('')
                  : onChange('create')
              }
              style={
                selectedTreeItem && selectedTreeItem[0]?.subType == 'document'
                  ? { opacity: 0.6, cursor: 'not-allowed' }
                  : { cursor: 'pointer' }
              }
            />
          </div>
        )}
      </div>
      <Divider className={classes.separator} />
      <main className={classes.main}>{children}</main>
    </Box>
  );
};

export default MainPanel;
