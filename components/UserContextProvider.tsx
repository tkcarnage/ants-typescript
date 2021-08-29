import React, { useState, useEffect, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext({
  isLoggedIn: false,
  username: '',
})

const STORAGE_KEY = 'userState'

const UserContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // on app load check if userState is saved in AsyncStorage

  useEffect(() => {
    (async () => {
      try {
        const storedUserState = await AsyncStorage.getItem(STORAGE_KEY);
        //console.log('AsyncStorage state-->', storedUserState)
        if(storedUserState !== null) {
          // value previously stored
          const parsedUserState = JSON.parse(storedUserState);
          setUsername(parsedUserState?.username);
          setIsLoggedIn(parsedUserState?.isLoggedIn);
        }
      } catch(err) {
        // error reading value
        console.error(err);
      }
    })()
  }, [])
  
  const handleLogOut = async () => {
    try {
      // reset userState
      const isRemovedState = await AsyncStorage.removeItem(STORAGE_KEY, () => {
        setIsLoggedIn(false);
        setUsername('');
      });
    } catch(err) {
      // error reading value
      console.error(err);
    }
  }
  // basic mock login, password should be salted and hashed with secret string in real prod
  const handleLogIn = async ({username, password} : 
    {username: string, password: string}) => {
    try {
      const userState = {
        isLoggedIn: true,
        username,
      }
      // skipped auth/permission with password
      // skipped setting device-id and token from backend 
      const isLoggedInState = await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userState))
      setIsLoggedIn(true);
      setUsername(username);
    } catch(err) {
      // error reading value
      console.error(err);
    }
  }

  return (
    <UserContext.Provider value={{ handleLogOut, handleLogIn, isLoggedIn, username }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;