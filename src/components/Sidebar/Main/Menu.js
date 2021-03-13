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

export const setMenuListByRole = (role) => {
  if (role === 'super-admin') {
    return [
      {
        icon: faTachometerAlt,
        text: 'Dashboard',
        url: '/dashboard'
      },
      {
        icon: faFlagUsa,
        text: 'States',
        url: '/states'
      },
      {
        icon: faBroadcastTower,
        text: 'Stations',
        url: '/stations'
      },
      {
        icon: faSchool,
        text: 'Districts',
        url: '/school-districts'
      },
      { icon: faStoreAlt, text: 'Schools', url: '/schools' },
      { icon: faChalkboardTeacher, text: 'Classes', url: '/classes' },
      { icon: faBookOpen, text: 'Materials', url: '/materials' },
      { icon: faBox, text: 'Packages', url: '/packages' },
      {
        icon: faBookMedical,
        text: 'Galleries',
        url: '/galleries',
        submenu: [
          {
            icon: faBookMedical,
            text: 'PBS',
            url: '/galleries/pbs'
          }
          // {
          //   icon: faBookMedical,
          //   text: 'OER',
          //   url: '/galleries/oer'
          // }
        ]
      },
      {
        icon: faFileArchive,
        text: 'Archives',
        url: '/archives'
      },
      {
        icon: faCommentAlt,
        text: 'Messages',
        url: '/messages'
      },
      {
        icon: faChartBar,
        text: 'Analytics',
        url: '/analytics'
      },
      {
        icon: faUsersCog,
        text: 'Users',
        url: '/users'
      },
      {
        icon: faTools,
        text: 'Configs',
        url: '/configurations'
      }
    ];
  }

  if (role === 'system-admin') {
    return [
      {
        icon: faTachometerAlt,
        text: 'Dashboard',
        url: '/dashboard'
      },
      {
        icon: faFlagUsa,
        text: 'States',
        url: '/states'
      },
      {
        icon: faBroadcastTower,
        text: 'Stations',
        url: '/stations'
      },
      {
        icon: faSchool,
        text: 'Districts',
        url: '/school-districts'
      },
      { icon: faStoreAlt, text: 'Schools', url: '/schools' },
      { icon: faChalkboardTeacher, text: 'Classes', url: '/classes' },
      { icon: faBookOpen, text: 'Materials', url: '/materials' },
      { icon: faBox, text: 'Packages', url: '/packages' },
      {
        icon: faBookMedical,
        text: 'Galleries',
        url: '/galleries',
        submenu: [
          {
            icon: faBookMedical,
            text: 'PBS',
            url: '/galleries/pbs'
          },
          {
            icon: faBookMedical,
            text: 'OER',
            url: '/galleries/oer'
          }
        ]
      },
      {
        icon: faFileArchive,
        text: 'Archives',
        url: '/archives'
      },
      {
        icon: faCommentAlt,
        text: 'Messages',
        url: '/messages'
      },
      {
        icon: faChartBar,
        text: 'Analytics',
        url: '/analytics'
      },
      {
        icon: faUsersCog,
        text: 'Users',
        url: '/users'
      }
    ];
  }

  return [];
};
