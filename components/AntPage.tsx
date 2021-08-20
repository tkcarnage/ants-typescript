import { StatusBar } from 'expo-status-bar';
import React, { useReducer, useEffect } from 'react';
import { Text, View, SafeAreaView, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useQuery } from 'urql';
import styled from 'styled-components';
import AntInfoCard from './AntInfoCard';
import AntCalculateItem from './AntCalculateItem';

const SafeContainerView = styled(SafeAreaView)`
  flex: 1;
`;

const InnerScrollView = styled(ScrollView)`
  flex: 1;
`;

const AntInfoSection = styled(View)`
  flex: 1;
  padding-vertical: 18px;
  padding-horizontal: 36px;
`;

const SectionTitle = styled(Text)`
  font-size: 25px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 25px;
`;

const AntRaceSection = styled(View)`
  flex: 1;
  padding-vertical: 18px;
  padding-horizontal: 36px;
`;

const Center = styled(View)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ErrorMessage = styled(Text)`
  color: red;
`;

const CalculateButton = styled(Pressable)`
  width: 100%;
  padding: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000000;
`;

const ButtonText = styled(Text)`
  color: #ffffff;
`;

// graphql query
const AntsQuery = `
  query {
    ants {
      name
      color
      length
      weight
    } 
  }
`;

const initState = {
  hasRun: false,
  runTest: false,
  winPercentage: null,
}

const runningState = {
  hasRun: true,
  runTest: true
}

const RUN_TESTS = 'RUN_TESTS';
const UPDATE_WIN_PERCENTAGE = 'UPDATE_WIN_PERCENTAGE';
// reducer
const reducer = (state, action) => {
  console.log('reducer state-->', state);
  switch (action.type) {
    case 'SET_TESTS':
      return [...action.payload.tests];
    case RUN_TESTS:
      console.log('run test state-->', state.map((ant) => {
        return { name: ant?.name, ...runningState }
      }))
      return state.map((ant) => {
        return { name: ant?.name, ...runningState }
      });
    case UPDATE_WIN_PERCENTAGE:
      const filteredArr = state.filter(ant => ant?.name !== action?.payload?.name);
      console.log('update win percentage -->', [...filteredArr,
      {
        name: action?.payload?.name,
        hasRun: true,
        runTest: false,
        winPercentage: (action?.payload?.winPercentage * 100).toFixed(2),
      }])
      return [...filteredArr,
      {
        name: action?.payload?.name,
        hasRun: true,
        runTest: false,
        winPercentage: (action?.payload?.winPercentage * 100).toFixed(2),
      }]
  }
}

const AntPage = () => {
  const [result, reexecuteQuery] = useQuery({
    query: AntsQuery,
  });

  const { data = { ants: [] }, fetching, error } = result;

  const { ants } = data;

  const testRunArray = ants.map((ant, idx) => {
    return { name: ant?.name, ...initState };
  });

  const [state, dispatch] = useReducer(reducer, testRunArray);


  //actions
  const startTests = () => {
    dispatch({ type: RUN_TESTS });
  }

  // curry
  const updateWinPercentage = (name: string) => {
    return (winPercentage: number) => dispatch({ type: UPDATE_WIN_PERCENTAGE, payload: { name, winPercentage } });
  }

  if (fetching) {
    return (
      <Center>
        <ActivityIndicator size="large" />
      </Center>
    )
  }

  if (error) {
    return (
      <Center>
        <ErrorMessage>Error: {error}</ErrorMessage>
      </Center>
    )
  }

  return (
    <SafeContainerView>
      <InnerScrollView>
        <AntInfoSection>
          <SectionTitle>Our Contestants</SectionTitle>
          {ants.map((antInfo: { name: string, color: string, length: number, weight: number }, idx: number) => {
            const { name, color, length, weight } = antInfo;
            return (
              <AntInfoCard
                key={`${name}-${idx}`}
                last={idx === ants.length}
                name={name}
                color={color}
                length={length}
                weight={weight}
              />)
          })}
        </AntInfoSection>
        <AntRaceSection>
          <SectionTitle>Ant Win Calculator</SectionTitle>
          <CalculateButton onPress={() => startTests()}>
            <ButtonText>Calculate</ButtonText>
          </CalculateButton>
          {state.map((test: { name: string, hasRun: boolean, runTest: boolean, winPercentage: null | number }, idx: number) => {
            const { name, hasRun, runTest, winPercentage } = test;
            return (
              <AntCalculateItem
                key={`${name}-${idx}`}
                antName={name}
                hasRun={hasRun}
                runTest={runTest}
                winPercentage={winPercentage}
                updateWinPercentage={updateWinPercentage}
              />)
          })}
        </AntRaceSection>
      </InnerScrollView>
    </SafeContainerView>
  );
}

export default AntPage;