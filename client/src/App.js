import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Home from './pages/Home';
import Detail from './pages/Detail';
import NoMatch from './pages/NoMatch';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Nav from './components/Nav';
import OrderHistory from './pages/OrderHistory';
import Success from './pages/Success';

// Set up gql http link
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Set up authorization link using JWT 
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Initialize apollo client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// JSX
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <Nav />
          <Routes>
            <Route 
              path="/" 
              element={<Home />} 
            />
            <Route 
              path="/login" 
              element={<Login />}
            />
            <Route 
              path="/signup" 
              element={<Signup />} 
            />
            <Route 
              path="/orderHistory" 
              element={<OrderHistory />} 
            />
            <Route 
              path="/products/:id" 
              element={<Detail />}
            />
            <Route
              path="/success"
              element={<Success />}
            />
            <Route 
              path="*" 
              element={<NoMatch />}
            />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

// Export app
export default App;
