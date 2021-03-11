import React from 'react';
import { Switch, withRouter } from 'react-router-dom';

import { DashboardLayout, BasicLayout } from '@app/layouts';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import RestrictedRoute from './RestrictedRoute';

import NotFound from '@app/containers/NotFound';
import { LoginContainer, ForgotPasswordContainer } from '@app/containers/Auth';
import DashboardContainer from '@app/containers/Dashboard';
import StateContainer from '@app/containers/State';
import StationContainer from '@app/containers/Station';
import DistrictContainer from '@app/containers/District';
import SchoolContainer from '@app/containers/School';
import ClassContainer from '@app/containers/Class';
import MaterialContainer from '@app/containers/Material';
import PackageContainer from '@app/containers/Package';
import { PBSContainer, OERContainer } from '@app/containers/Gallery';
import ArchiveContainer from '@app/containers/Archive';
import MessageContainer from '@app/containers/Message';
import AnalyticContainer from '@app/containers/Analytic';
import UserContainer from '@app/containers/User';
import TutorialContainer from '@app/containers/Message';
import SettingContainer from '@app/containers/Setting';
import ConfigContainer from '@app/containers/Config';

const AppRoutes = () => (
  <Switch>
    <RestrictedRoute
      exact
      path="/"
      component={LoginContainer}
      layout={BasicLayout}
    />
    <RestrictedRoute
      exact
      path="/forgot-password"
      component={ForgotPasswordContainer}
      layout={BasicLayout}
    />
    <PrivateRoute
      path="/dashboard"
      component={DashboardContainer}
      layout={DashboardLayout}
    />
    <PrivateRoute
      path="/classes/:classId?"
      component={ClassContainer}
      layout={DashboardLayout}
    />
    <PrivateRoute
      path="/materials/:materialId?"
      component={MaterialContainer}
      layout={DashboardLayout}
    />
    <PrivateRoute
      path="/stations/:stationId?"
      component={StationContainer}
      layout={DashboardLayout}
    />
    <PrivateRoute
      path="/schools/:schoolId?"
      component={SchoolContainer}
      layout={DashboardLayout}
    />
    <PrivateRoute
      path="/school-districts/:districtId?"
      component={DistrictContainer}
      layout={DashboardLayout}
    />
    <PrivateRoute
      path="/states/:stateId?"
      component={StateContainer}
      layout={DashboardLayout}
    />
    <PrivateRoute
      path="/packages/:packageId?"
      component={PackageContainer}
      layout={DashboardLayout}
    />
    <PrivateRoute
      path="/analytics"
      component={AnalyticContainer}
      layout={DashboardLayout}
    />
    <PrivateRoute
      path="/galleries/pbs"
      component={PBSContainer}
      layout={DashboardLayout}
    />
    <PrivateRoute
      path="/galleries/oer"
      component={OERContainer}
      layout={DashboardLayout}
    />
    <PrivateRoute
      path="/archives/:archiveId?"
      component={ArchiveContainer}
      layout={DashboardLayout}
    />
    <PrivateRoute
      path="/messages/:messageId?"
      component={MessageContainer}
      layout={DashboardLayout}
    />
    <PrivateRoute
      path="/tutorials"
      component={TutorialContainer}
      layout={DashboardLayout}
    />
    <PrivateRoute
      path="/settings"
      component={SettingContainer}
      layout={DashboardLayout}
    />
    <PrivateRoute
      path="/configurations/:configId?"
      component={ConfigContainer}
      layout={DashboardLayout}
    />
    <PrivateRoute
      path="/users/:type?/:userId?"
      component={UserContainer}
      layout={DashboardLayout}
    />
    <PublicRoute path="**" component={NotFound} layout={BasicLayout} />
  </Switch>
);

export default withRouter(AppRoutes);
