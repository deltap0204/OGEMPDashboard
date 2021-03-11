import React, { useState, useContext } from 'react';

const StateContext = React.createContext(null);
StateContext.displayName = 'StateContext';

const initialState = {
  dashboard: null,
  state: null,
  station: null,
  district: null,
  school: null,
  classe: null,
  material: null,
  package: null,
  gallery: null,
  archive: null,
  messages: null,
  analytic: null,
  people: null,
  config: null,
  superAdmin: null,
  schoolAdmin: null,
  systemAdmin: null,
  stationAdmin: null,
  districtAdmin: null
};

const StateContextProvider = ({ ...props }) => {
  const [state, setState] = useState(initialState);

  const value = [state, setState];

  return <StateContext.Provider value={value} {...props} />;
};

const useStateContext = () => {
  return useContext(StateContext);
};

export { StateContextProvider, useStateContext };
