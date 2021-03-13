import React, { useState } from 'react';
import config from '@app/Config';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { onError } from '@apollo/client/link/error';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  split
} from '@apollo/client';
import { Authenticator, SignIn, Greetings } from 'aws-amplify-react';
import { ThemeProvider } from '@material-ui/core';
import AppRoutes from '@app/router';
import theme from '@app/styles/theme';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import AppContext from '@app/AppContext';
import { StateContextProvider } from '@app/providers/StateContext';

const App = () => {
  const [context, setContext] = useState();

  const httpLink = new HttpLink({
    uri: config.apolloLinks.http
  });

  const wsLink = new WebSocketLink({
    uri: config.apolloLinks.ws,
    options: {
      reconnect: true
    }
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
      window.location.href = '/network-error';
    }
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);

      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    link: errorLink.concat(splitLink),
    cache: new InMemoryCache(),
    resolvers: {}
  });

  return (
    <Authenticator hide={[SignIn, Greetings]} amplifyConfig={config.aws}>
      <ApolloProvider client={client}>
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
      </ApolloProvider>
    </Authenticator>
  );
};

export default App;
