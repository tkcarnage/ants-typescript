import Login from './Login';
import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native';
import styled from 'styled-components'
import AntPage from './AntPage';
import LoginPage from './LoginPage';
import { UserContext } from './UserContextProvider';

const Container = styled(SafeAreaView)`
  flex: 1;
`;

const Nav = () => {
  // UserStateContext for log in and log out
  // simple nav to go between loginpage and antpage
  const userContext = useContext(UserContext);
  const { handleLogOut, handleLogIn, isLoggedIn, username } = userContext;
  return (
    <Container>
      {isLoggedIn ? 
        <AntPage 
          handleLogOut={handleLogOut}
          username={username}
        />
         : 
        <LoginPage handleLogIn={handleLogIn}/>}
    </Container>
  );
}

export default Nav;