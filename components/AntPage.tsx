import { StatusBar } from 'expo-status-bar';
import React, { 
  useReducer, 
  useEffect, 
  useState, 
  useContext 
} from 'react';
import { Text, View, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { stringifyVariables, useQuery } from 'urql';
import styled from 'styled-components';
import AntInfoCard from './AntInfoCard';
import AntCalculateItem from './AntCalculateItem';
import Logout from './Logout';
import AntCarousel from './AntCarousel';

const ContainerView = styled(View)`
  flex: 1;
`;

const InnerScrollView = styled(ScrollView)`
  flex-grow: 1;
`;

const AntInfoSection = styled(View)`
  padding-vertical: 18px;
  padding-horizontal: 36px;
`;

const WelcomeTitle = styled(Text)`
  font-size: 24px;
  color: #00916E;
  font-weight: bold;
  flex: 1;
`;

const SectionTitle = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #00916E;
  margin-bottom: 8px;
`;

const AntRaceSection = styled(View)`
  padding-vertical: 18px;
  padding-horizontal: 18px;
  margin-horizontal: 36px;
  background-color: #f6f6f6;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
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

const CalculateButton = styled(TouchableOpacity)`
  width: 100%;
  padding: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #00916E;
  margin-bottom: 18px;
  opacity: ${({disabled}) =>  disabled ? '0.5' : '1'};
`;

const ButtonText = styled(Text)`
  font-size: 16px;
  color: #ffffff;
`;

const TestRunStatus = styled(Text)`
  font-size: 16px;
  text-align: center;
  padding-bottom: 20px;
`;

const TopSection = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 25px;
  width: 100%;
  background-color: #ffffff;
  padding-vertical: 24px;
  padding-horizontal: 4px;
`;

// constants for state and query
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
const reducer = (state: [], 
    action: { type: string, payload: { tests: [], name: string, winPercentage: number}}
  ) => {
  switch (action.type) {
    case SET_TESTS:
      return [...action.payload.tests];
    case RUN_TESTS:
      const arr = state.filter((ant: { name: string }) => ant?.name !== action?.payload?.name);
      return [...arr,
      {
        name: action?.payload?.name,
        ...runningState,
      }]
    case UPDATE_WIN_PERCENTAGE:
      const filteredArr = state.filter((ant: { name: string }) => ant?.name !== action?.payload?.name);
      return [...filteredArr,
      {
        name: action?.payload?.name,
        winPercentage: (action?.payload?.winPercentage * 100),
        ...completedState,
      }]
  }
}

const AntPage = ({ handleLogOut, username }: { username: string }) => {
  // state
  const [state, dispatch] = useReducer(reducer, []);

  // Query results
  const [result, reexecuteQuery] = useQuery({
    query: AntsQuery,
  });
  const { data, fetching, error } = result;
  const ants = data?.ants || []
  // when ants array changes from fetch run set_tests reducer
  useEffect(() => {
    const { data = { ants: [] }, fetching, error } = result;
    const { ants } = data;
    const testRunArray = ants.map((ant: { name: string }, idx: number) => {
      return { name: ant?.name, ...initState };
    });

    if (testRunArray.length > 0) {
      dispatch({ type: SET_TESTS, payload: { tests: testRunArray } })
    }

  }, [ants])

  //overall test states
  const [allTestsFinished, setAllTestsFinished] = useState(false);
  const [allTestsInProgress, setAllTestsInProgress] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    const antsFinished = state.filter(ant => {
      const finished = ant?.hasRun && !ant?.inProgress && ant?.winPercentage;
      return finished && ant
    })
    // check if all ants are finished
    const lengthCheck = antsFinished.length === state.length && antsFinished.length > 0;
    if (lengthCheck) {
      setAllTestsFinished(true);
      setAllTestsInProgress(false);
      setDisableButton(false);
    }
  }, [state])


  //actions
  // curry for callback since we can't modifiy algo
  const updateWinPercentage = (name: string) => {
    return (winPercentage: number) => dispatch({ type: UPDATE_WIN_PERCENTAGE, payload: { name, winPercentage } });
  }

  const setRunningTest = (name: string) => {
    dispatch({ type: RUN_TESTS, payload: { name } });
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

  /* 
    TODO:
    Make reset reducer, action, add it to handlePress to reset state for ants. 
  */
  const handlePress = (stateArr: []) => {
    setAllTestsInProgress(true);
    setDisableButton(true);
    setAllTestsFinished(false);
    stateArr.forEach((element: { name: string }, idx: number) => {
      // need new instance of asyncWinCallback for different random numbers in closure
      setRunningTest(element.name)
      const asyncWinCallback = generateAntWinLikelihoodCalculator();
      const dispatchUpdateWinPercentage = updateWinPercentage(element.name);
      asyncWinCallback(dispatchUpdateWinPercentage);
    })
  }

  const notStartedAllTests = !allTestsFinished && !allTestsInProgress;

  // short circuit for loading, and error
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
    <ContainerView>
      <InnerScrollView stickyHeaderIndices={[0]}>
        <TopSection>
          <WelcomeTitle numberOfLines={1}>{`Welcome! ${username}`}</WelcomeTitle>
          <Logout handleLogOut={handleLogOut} />
        </TopSection>
        <AntInfoSection>
          <SectionTitle>The Contestants</SectionTitle>
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
          {notStartedAllTests && <TestRunStatus>All tests not yet run...</TestRunStatus>}
          {allTestsInProgress && <TestRunStatus>All tests in progress...</TestRunStatus>}
          {allTestsFinished && <TestRunStatus>All tests finished!</TestRunStatus>}
          <CalculateButton onPress={() => handlePress(state)} disabled={disableButton}>
            <ButtonText>Calculate</ButtonText>
          </CalculateButton>
          {state.sort(compare).map((test: { name: string, hasRun: boolean, winPercentage: null | number, inProgress: boolean }, idx: number) => {
            const { name, hasRun, winPercentage, inProgress } = test;
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
        <AntCarousel ants={ants}/>
      </InnerScrollView>
    </ContainerView>
  );
}

export default AntPage;