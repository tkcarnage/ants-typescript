import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, ScrollView } from 'react-native';
import styled from 'styled-components';

const TestCaseContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: #ffffff;
  margin-bottom: 8px;
  background-color: ${({ inProgress, winPercentage }) => inProgress ? 'rgba(0, 145, 110, 0.4)' : (winPercentage ? 'rgba(0, 145, 110, 0.8)' :'#e1e1e1')};
`;

const AntName = styled(Text)`
  flex: 1;
  margin-right: 4px;
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
    <TestCaseContainer inProgress={inProgress} winPercentage={winPercentage}>
      <AntName numberOfLines={1}>{antName}:</AntName>
      <RightContent>
        {!hasRun && <NotRanText>Not yet run...</NotRanText>}
        {!winPercentage && inProgress && <InProgressText>In Progress...</InProgressText>}
        {winPercentage && <WinPercentageText>Calculated: {winPercentage.toFixed(2)}% </WinPercentageText>}
      </RightContent>
    </TestCaseContainer>
  );
}

export default AntCalculateItem;