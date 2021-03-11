import notiArchive from './archive';
import notiClass from './class';
import notiDashboard from './dashboard';
import notiEmail from './email';
import notiGallery from './gallery';
import notiMessage from './message';
import notiPackage from './package';
import notiPeople from './people';
import notiSchool from './school';
import notiSetting from './setting';
import notiStation from './station';
import notiConfig from './config';
import notiState from './state';
import notiDistrict from './district';
import notiMaterial from './material';
import { getCurrentUTCTime } from '@app/utils/date-manager';

const getNotificationGroup = (str) => {
  switch (str) {
    case 'station':
      return notiStation;
    case 'class':
      return notiClass;
    case 'school':
      return notiSchool;
    case 'archive':
      return notiArchive;
    case 'dashboard':
      return notiDashboard;
    case 'email':
      return notiEmail;
    case 'gallery':
      return notiGallery;
    case 'oer':
      return notiGallery;
    case 'pbs':
      return notiGallery;
    case 'message':
      return notiMessage;
    case 'people':
      return notiPeople;
    case 'package':
      return notiPackage;
    case 'setting':
      return notiSetting;
    case 'config':
      return notiConfig;
    case 'state':
      return notiState;
    case 'district':
      return notiDistrict;
    case 'material':
      return notiMaterial;
    default:
      return null;
  }
};

const loggingStatus = (message, variant, document) => {
  const currTimeStamp = getCurrentUTCTime();
  const documenId = document ? document['_id'] : null;
  console.log(`${currTimeStamp}|${variant}|${documenId}|${message}`);
};

export const getNotificationOpt = (
  containerName,
  variant,
  action,
  options,
  document
) => {
  const notificationGroup = getNotificationGroup(containerName);

  if (!notificationGroup) {
    const message = `The ${containerName} container doesn't exist.
      please double-check that you registered it exactly.`;

    loggingStatus(message, variant, document);
    return {
      message,
      options: {
        variant: 'warning',
        autoHideDuration: 10000
      }
    };
  }

  if (!notificationGroup[variant]) {
    const message = `The ${variant} type alert doesn't exist.
      please double-check that you registered it exactly.`;

    loggingStatus(message, variant, document);
    return {
      message,
      options: {
        variant: 'warning',
        autoHideDuration: 10000
      }
    };
  }

  if (options) {
    if (!notificationGroup[variant][options][action]) {
      const message = `The ${action} action doesn't exist.
        please double-check that you registered it exactly.`;

      loggingStatus(message, variant, document);
      return {
        message,
        options: {
          variant: 'warning',
          autoHideDuration: 10000
        }
      };
    }

    const message = notificationGroup[variant][options][action].message;
    loggingStatus(message, variant, document);
    return notificationGroup[variant][options][action];
  }

  if (!notificationGroup[variant][action]) {
    const message = `The ${action} action doesn't exist.
      please double-check that you registered it exactly.`;
    loggingStatus(message, variant);

    return {
      message,
      options: {
        variant: 'warning',
        autoHideDuration: 10000
      }
    };
  }

  const message = notificationGroup[variant][action].message;
  loggingStatus(message, variant);
  return notificationGroup[variant][action];
};
