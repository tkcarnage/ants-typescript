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

const NotRanText = styled(Text)`
  font-weight: bold;
`;

const InProgressText = styled(Text)`
  font-weight: bold;
`;

const WinPercentageText = styled(Text)`
  font-weight: bold;
`;

const AntCalculateItem = ({
  antName,
  hasRun,
  winPercentage,
  inProgress,
}: {
  antName: string,
  hasRun: boolean,
  winPercentage: null | number,
  inProgress: boolean
}
) => {
  return (
    <TestCaseContainer>
      <AntName>{antName}:</AntName>
      <RightContent 
        inProgress={inProgress} 
        winPercentage={winPercentage}>
        {!hasRun && <NotRanText>Not yet run...</NotRanText>}
        {!winPercentage && inProgress && <InProgressText>In Progress...</InProgressText>}
        {winPercentage && <WinPercentageText>Calculated: {winPercentage.toFixed(2)}% </WinPercentageText>}
      </RightContent>
    </TestCaseContainer>
  );
}

export default AntCalculateItem;