import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import styled from 'styled-components';
import AntPage from './components/AntPage';
import { createClient, Provider } from 'urql';

const client = createClient({
  url: `https://sg-ants-server.herokuapp.com/graphql`,
});

const ContainerView = styled(View)`
  display: flex;
  flex: 1;
`;

const App = () => {
  return (
    <Provider value={client}>
      <ContainerView>
        <StatusBar style="auto" />
        <AntPage />
      </ContainerView>
    </Provider>
  );
}

export default App;