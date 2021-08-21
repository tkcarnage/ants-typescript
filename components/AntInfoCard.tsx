import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View, SafeAreaView, ScrollView } from 'react-native';
import styled from 'styled-components';

const Card = styled(View)`
  color: black;
  flex-direction: row;
  background-color: #f6f6f6;
  padding: 16px;
  margin-bottom: 8px;
  font-size: 16px;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
`;

const NameText = styled(Text)``;

const LengthText = styled(Text)``;

const ColorText = styled(Text)``;

const WeightText = styled(Text)``;

const Column = styled(View)`
  display: flex;
  flex: 0 1 auto;
`;

const Label = styled(Text)`
  font-weight: bold;
`;

const AntInfoCard = ({ last, name, color, length, weight }: { last: boolean, name: string, color: string, length: number, weight: number }) => {
  return (
    <Card>
      <Column>
        <Label>Name: </Label>
        <Label>Color: </Label>
        <Label>Length: </Label>
        <Label>Weight: </Label>
      </Column>
      <Column>
        <NameText numberOfLines={1}>{name}</NameText>
        <ColorText numberOfLines={1}>{color}</ColorText>
        <LengthText numberOfLines={1}>{length} mm</LengthText>
        <WeightText numberOfLines={1}>{weight} mg</WeightText>
      </Column>
    </Card>
  );
}

export default AntInfoCard;