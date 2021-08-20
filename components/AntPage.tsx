import { StatusBar } from 'expo-status-bar';
import React, { useReducer, useEffect, useState } from 'react';
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
  margin-bottom: 18px;
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
  inProgress: false,
  winPercentage: null,
}

const runningState = {
  hasRun: true,
  inProgress: true,
}

const completedState = {
  hasRun: true,
  inProgress: false,
}

const SET_TESTS = 'SET_TESTS';
const UPDATE_WIN_PERCENTAGE = 'UPDATE_WIN_PERCENTAGE';
const RUN_TESTS = 'RUN_TESTS';
// reducer
const reducer = (state, action) => {
  switch (action.type) {
    case SET_TESTS:
      return [...action.payload.tests];
    case RUN_TESTS:
      const arr = state.filter(ant => ant?.name !== action?.payload?.name);
      return [...arr,
      {
        name: action?.payload?.name,
        ...runningState,
      }]
    case UPDATE_WIN_PERCENTAGE:
      const filteredArr = state.filter(ant => ant?.name !== action?.payload?.name);
      return [...filteredArr,
      {
        name: action?.payload?.name,
        winPercentage: (action?.payload?.winPercentage * 100),
        ...completedState,
      }]
  }
}

const AntPage = () => {
  const [result, reexecuteQuery] = useQuery({
    query: AntsQuery,
  });

  const [state, dispatch] = useReducer(reducer, []);
  const { data, fetching, error } = result;
  const ants = data?.ants || []

  // when ants array becomes filled from fetch run set_tests reducer
  useEffect(() => {
    const { data = { ants: [] }, fetching, error } = result;
    const { ants } = data;
    const testRunArray = ants.map((ant, idx) => {
      return { name: ant?.name, ...initState };
    });
    if (testRunArray.length > 0) {
      dispatch({ type: SET_TESTS, payload: { tests: testRunArray } })
    }

  }, [ants])


  //actions
  // curry for callback since we can't modifiy algo
  const updateWinPercentage = (name: string) => {
    return (winPercentage: number) => dispatch({ type: UPDATE_WIN_PERCENTAGE, payload: { name, winPercentage } });
  }

  const setRunningTest = (name: string) => {
    dispatch({ type: RUN_TESTS, payload: { name } });
  }


  // short circuit for loading and error
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

  // sort function
  const compare = (a: { winPercentage: number }, b: { winPercentage: number }) => {
    if (a?.winPercentage > b?.winPercentage) {
      return -1;
    }
    if (b?.winPercentage > a?.winPercentage) {
      return 1;
    }
  }

  // ant-win algo
  function generateAntWinLikelihoodCalculator() {
    const delay = 7000 + Math.random() * 7000;
    const likelihoodOfAntWinning = Math.random();

    return (callback) => {
      setTimeout(() => {
        callback(likelihoodOfAntWinning);
      }, delay);
    };
  }



  const handlePress = (stateArr: []) => {
    stateArr.forEach((element: { name: string }, idx: number) => {
      // need new instance of asyncWinCallback for different numbers in closure
      setRunningTest(element.name)
      const asyncWinCallback = generateAntWinLikelihoodCalculator();
      const dispatchUpdateWinPercentage = updateWinPercentage(element.name);
      asyncWinCallback(dispatchUpdateWinPercentage);
    })
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
          <CalculateButton onPress={() => handlePress(state)}>
            <ButtonText>Calculate</ButtonText>
          </CalculateButton>
          {state.sort(compare).map((test: { name: string, hasRun: boolean, runTest: boolean, winPercentage: null | number, inProgress: boolean }, idx: number) => {
            const { name, hasRun, runTest, winPercentage, inProgress } = test;
            return (
              <AntCalculateItem
                key={`${name}-${idx}`}
                antName={name}
                hasRun={hasRun}
                winPercentage={winPercentage}
                inProgress={inProgress}
              />)
          })}
        </AntRaceSection>
      </InnerScrollView>
    </SafeContainerView>
  );
}

export default AntPage;