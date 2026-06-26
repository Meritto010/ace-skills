import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isActivated, setIsActivated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkActivationStatus();
  }, []);

  const checkActivationStatus = async () => {
    const status = await AsyncStorage.getItem('@is_activated');
    setIsActivated(status === 'true');
    setIsLoading(false);
  };

  const login = async (licenseKey) => {
    await AsyncStorage.setItem('@is_activated', 'true');
    await AsyncStorage.setItem('@activated_license', licenseKey);
    setIsActivated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@is_activated');
    await AsyncStorage.removeItem('@activated_license');
    setIsActivated(false);
  };

  return (
    <AuthContext.Provider value={{ isActivated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
