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
    try {
      const status = await AsyncStorage.getItem('@is_activated');
      setIsActivated(status === 'true');
    } catch (error) {
      console.error("Error checking activation status", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (licenseKey) => {
    try {
      await AsyncStorage.setItem('@is_activated', 'true');
      await AsyncStorage.setItem('@activated_license', licenseKey);
      setIsActivated(true);
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@is_activated');
      await AsyncStorage.removeItem('@activated_license');
      setIsActivated(false);
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isActivated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
