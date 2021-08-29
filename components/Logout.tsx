import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity,
 } from 'react-native';
import styled from 'styled-components';

const LogoutButton = styled(TouchableOpacity)`
  background-color: #00916E;
  padding-horizontal: 16px;
  padding-vertical: 8px;
`;

const LogoutText = styled(Text)`
  text-align: center;
  color: #ffffff;
`;

const Loginout = ({ handleLogOut }) => {
  return (
    <LogoutButton
      onPress={() => handleLogOut()}
      >
      <LogoutText>Logout</LogoutText>
    </LogoutButton>
  );
}

export default Loginout;


