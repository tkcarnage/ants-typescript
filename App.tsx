import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import styled from 'styled-components';
import Nav from './components/Nav';
import UserContextProvider from './components/UserContextProvider';
import { createClient, Provider } from 'urql';

const client = createClient({
  url: `https://sg-ants-server.herokuapp.com/graphql`,
});

const ContainerView = styled(View)`
  display: flex;
  flex: 1;
  background-color: #e1e1e1;
`;

const App = () => {
  return (
    <Provider value={client}>
      <ContainerView>
        <StatusBar style="auto" />
        <UserContextProvider>
          <Nav />
        </UserContextProvider>
      </ContainerView>
    </Provider>
  );
}

export default App;