import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({
  userToken: null,
  setIsAuthenticated: () => {},
});

const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        if (token !== null) {
          setUserToken(token);
        }
      } catch (e) {
        console.log(e);
      }
    };

    checkUserToken();
  }, []);

  const setIsAuthenticated = (token) => {
    setUserToken(token);
  };

  return (
    <AuthContext.Provider value={{ userToken, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
