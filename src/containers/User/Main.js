import React from 'react';
import { MainPanel } from '@app/components/Panels';
import { faUsersCog } from '@fortawesome/free-solid-svg-icons';
import useStyles from './style';

const UserMain = () => {
  const classes = useStyles();
  const handlePanelChange = (type, value) => {};

  return (
    <MainPanel
      title="Users"
      icon={faUsersCog}
      showAddBtn
      onChange={handlePanelChange}
    ></MainPanel>
  );
};

export default UserMain;
