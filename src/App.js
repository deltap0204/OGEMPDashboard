import React, { useState } from 'react';
import { ThemeProvider } from '@material-ui/core';
import AppRoutes from '@app/router';
import theme from '@app/styles/theme';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import AppContext from '@app/AppContext';
import { StateContextProvider } from '@app/providers/StateContext';

const App = () => {
  const [context, setContext] = useState();

  return (
    <AppContext.Provider value={[context, setContext]}>
      <StateContextProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={5}>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </SnackbarProvider>
        </ThemeProvider>
      </StateContextProvider>
    </AppContext.Provider>
  );
};

export default App;
