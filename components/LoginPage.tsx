import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
	StyleSheet
 } from 'react-native';
import styled from 'styled-components';


// styles
const Container = styled(SafeAreaView)`
  flex: 1;
  display: flex;
`;

const LoginButton = styled(TouchableOpacity)`
  background-color: #00916E;
  padding-vertical: 18px;
  padding-horizontal: 36px;
	width: 100%;
`;

const LoginText = styled(Text)`
  text-align: center;
  color: #ffffff;
`;

const StyledInput = styled(TextInput)`
	padding-horizontal: 9px;
	padding-vertical: 9px;
	border-width: 1px;
	width: 100%;
	max-width: 500px;
	border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
	margin-bottom: 16px;
`;

const ColContainer = styled(View)`
 	display: flex;
	align-items: center;
`;

const ColRightContainer = styled(View)`
 	display: flex;
	align-items: center;
	flex: 1;
`;

const Grid = styled(View)`
 	display: flex;
	flex-direction: row;
	margin-bottom: 9px;
	width: 100%;
`;

const Label = styled(Text)`
 margin-bottom: 16px;
 	padding-vertical: 9px;
`;

const Title = styled(Text)`
 text-align: center;
 font-size: 32px;
 font-weight: 800;
 color: #00916E;
 margin-bottom: 32px;
`;

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView)`
 flex: 1;
 align-items: center;
 justify-content: center;
 padding-horizontal: 36px;
`;

const LoginPage = ({ handleLogIn }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
  return (
    <Container>
      <StyledKeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
				<Title>Please Login</Title>
				<Grid>
					<ColContainer>
						<Label>Username: </Label>
						<Label>Password: </Label>
					</ColContainer>
					<ColRightContainer>
						<StyledInput
							placeholder="Username"
							onChangeText={setUsername}
							numberOfLines={1}
							autoCorrect={false}
						/>
						<StyledInput 
							placeholder="Password" 
							onChangeText={setPassword}
							secureTextEntry={true}
							numberOfLines={1}
							autoCorrect={false}
						/>
					</ColRightContainer>
				</Grid>
				<LoginButton
					disabled={false}
					onPress={() => handleLogIn({ password, username })}
				>
        	<LoginText>Login</LoginText>
        </LoginButton>
      </StyledKeyboardAvoidingView>
    </Container>
  );
}

export default LoginPage;