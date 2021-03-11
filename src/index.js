import React from 'react';
import ReactDOM from 'react-dom';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  split
} from '@apollo/client';
import config from '@app/Config';
import App from '@app/App';
import reportWebVitals from '@app/reportWebVitals';
import { Authenticator, SignIn, Greetings } from 'aws-amplify-react';
import '@app/styles/global.style.css';

const httpLink = new HttpLink({
  uri: config.apolloLinks.http
});

const wsLink = new WebSocketLink({
  uri: config.apolloLinks.ws,
  options: {
    reconnect: true
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
  link: splitLink,
  cache: new InMemoryCache(),
  resolvers: {}
});


ReactDOM.render(
  <Authenticator hide={[SignIn, Greetings]} amplifyConfig={config.aws}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Authenticator>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
