import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, ScrollView } from 'react-native';
import styled from 'styled-components';

const TestCaseContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 18px;
`;

const AntName = styled(Text)`
  flex: 1;
`;

const RightContent = styled(View)`
  flex: 1;
`;

const NotRanText = styled(Text)``;

const InProgressText = styled(Text)``;

const WinPercentageText = styled(Text)``;

const AntCalculateItem = ({
  antName,
  hasRun,
  runTest,
  winPercentage,
  updateWinPercentage,
}: {
  antName: string,
  hasRun: boolean,
  runTest: boolean,
  winPercentage: null | number,
  updateWinPercentage: any
}
) => {
  console.log('runTest-->', runTest)
  function generateAntWinLikelihoodCalculator() {
    const delay = 7000 + Math.random() * 7000;
    const likelihoodOfAntWinning = Math.random();

    return (callback) => {
      setTimeout(() => {
        callback(likelihoodOfAntWinning);
      }, delay);
    };
  }

  const asyncWinCallback = generateAntWinLikelihoodCalculator();

  useEffect(() => {
    (async () => {
      if (runTest) {
        console.log('running test on-->', antName)
        const dispatchUpdateWinPercentage = updateWinPercentage(antName);
        asyncWinCallback(dispatchUpdateWinPercentage);
      }
    })()
  }, [runTest])

  return (
    <TestCaseContainer>
      <AntName>{antName}</AntName>
      <RightContent>
        {!hasRun && <NotRanText>Not yet run...</NotRanText>}
        {!winPercentage && hasRun && <InProgressText>In Progress...</InProgressText>}
        {winPercentage && <WinPercentageText>Calculated: {winPercentage}% </WinPercentageText>}
      </RightContent>
    </TestCaseContainer>
  );
}

export default AntCalculateItem;