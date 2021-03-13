import React, { useEffect, useState, createElement } from 'react';
import { Link, useHistory, withRouter } from 'react-router-dom';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from '@material-ui/core/styles';
import {
  Box,
  List,
  Drawer,
  Divider,
  ListItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  MenuItem
} from '@material-ui/core';
import {
  faTachometerAlt,
  faCircle,
  faStoreAlt,
  faBox,
  faChartBar,
  faBookMedical,
  faFileArchive,
  faCommentAlt,
  faBroadcastTower,
  faCog,
  faInfoCircle,
  faSignOutAlt,
  faSchool,
  faTools,
  faFlagUsa,
  faChalkboardTeacher,
  faBookOpen,
  faUsersCog
} from '@fortawesome/free-solid-svg-icons';
import { setMenuListByRole } from './Menu';
import { Logout } from '../Logout/index';
import useStyles from './style';
import { Auth } from 'aws-amplify';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

const Menu = ({ el, selected, handleSelected, openMenu }) => {
  const classes = useStyles();
  const theme = useTheme();

  return el.submenu ? (
    <React.Fragment>
      <ListItem
        button
        onClick={() => handleSelected(el)}
        className={classes.listItems}
      >
        {el.icon ? (
          <ListItemIcon className={classes.listItemIcons}>
            <FontAwesomeIcon
              icon={el.icon}
              size="lg"
              color={theme.palette.primary.contrastText}
            />
          </ListItemIcon>
        ) : (
          []
        )}
        <ListItemText primary={el.text} />
        {openMenu ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openMenu} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {el.submenu.map((resource, i) => (
            <Link to={resource.url} style={{ textDecoration: 'none' }}>
              <MenuItem
                key="1"
                className={clsx(classes.nested, {
                  [classes.selectednested]: resource.url !== selected,
                  [classes.selectednested]: resource.url === selected
                })}
              >
                {/* <Icon type="home" /> */}
                <span>{resource.text}</span>
              </MenuItem>
            </Link>
          ))}
        </List>
      </Collapse>
    </React.Fragment>
  ) : (
    <Link to={el.url} style={{ textDecoration: 'none' }}>
      <ListItem
        button
        onClick={() => handleSelected(el)}
        className={clsx(classes.listItems, {
          [classes.listItems]: el.url !== selected,
          [classes.listItemsSelected]: el.url === selected
        })}
      >
        {el.icon ? (
          <ListItemIcon className={classes.listItemIcons}>
            <FontAwesomeIcon
              icon={el.icon}
              size="lg"
              color={
                el.url === selected
                  ? theme.palette.blueGrey['300']
                  : theme.palette.primary.contrastText
              }
            />
          </ListItemIcon>
        ) : (
          []
        )}
        <ListItemText primary={el.text} />
      </ListItem>
    </Link>
  );
};

const MainSidebar = ({ open, onChange, location }) => {
  const classes = useStyles();
  const history = useHistory();
  const [selected, setSelected] = useState('');
  const listElements = setMenuListByRole('super-admin');
  const [openMenu, setOpenMenu] = useState(false);

  const actionElements = [
    { icon: faInfoCircle, text: 'Tutorials', url: '/tutorials' },
    { icon: faCog, text: 'Settings', url: '/settings' }
    // { icon: faSignOutAlt, text: 'Logout', url: '/' }
  ];

  useEffect(() => {
    if (location) {
      const tmpUrl = `/${location.pathname.split('/')[1]}`;
      // const tmpUrl = `${location.pathname}`;
      setSelected(tmpUrl);
    }
  }, [location]);

  const handleDrawerClose = () => onChange(!open);

  const handleSelected = async (value) => {
    if (value.text === 'Logout') {
      await Auth.signOut();
      window.localStorage.clear();
      history.push('/');
    } else {
      setSelected(value.url);
      if (value.text === 'Galleries') {
        setOpenMenu((prevOpen) => !prevOpen);
      }
    }
  };

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.root, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open
      })}
      classes={{
        paper: clsx(classes.root, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })
      }}
    >
      <Box className={classes.toolbar}>
        <IconButton
          className={classes.openAndClose}
          onClick={handleDrawerClose}
        >
          {!open && <FontAwesomeIcon icon={faCircle} color="white" size="lg" />}
          {open && (
            <Box className={classes.logo}>
              <FontAwesomeIcon
                icon={faCircle}
                color="white"
                size="lg"
                style={{ marginRight: '15px' }}
              />
              <Typography variant="h6" component="h6">
                SIG EMP
              </Typography>
            </Box>
          )}
        </IconButton>
      </Box>
      <List className={classes.elList}>
        <Divider className={classes.separator} />
        {listElements.map((el, index) => (
          <Menu
            el={el}
            key={index}
            selected={selected}
            handleSelected={handleSelected}
            openMenu={openMenu}
          />
        ))}
      </List>
      <List className={classes.actionList}>
        <Divider className={classes.separator} />
        {actionElements.map((el, index) => (
          <Menu
            el={el}
            key={index}
            selected={selected}
            handleSelected={handleSelected}
          />
        ))}
      </List>

      <Logout />
    </Drawer>
  );
};

export default withRouter(MainSidebar);
