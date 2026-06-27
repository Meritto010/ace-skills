import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import STORAGE_KEYS from '../constants/storageKeys';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const DEFAULT_ACTIVATION_INFO = {
  isActivated: false,
  licenseKey: '',
  fullName: '',
  mobile: '',
  activatedOn: null,
};

export const AuthProvider = ({ children }) => {

  const [activationInfo, setActivationInfo] = useState(
    DEFAULT_ACTIVATION_INFO
  );

  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load activation data from AsyncStorage
   */
  const refreshActivation = useCallback(async () => {

    try {

      const stored = await AsyncStorage.getItem(
        STORAGE_KEYS.ACTIVATION_INFO
      );

      if (stored) {

        const parsed = JSON.parse(stored);

        setActivationInfo({
          ...DEFAULT_ACTIVATION_INFO,
          ...parsed,
        });

      } else {

        setActivationInfo(DEFAULT_ACTIVATION_INFO);

      }

    } catch (error) {

      console.log('AuthContext Load Error:', error);

      setActivationInfo(DEFAULT_ACTIVATION_INFO);

    } finally {

      setIsLoading(false);

    }

  }, []);

  useEffect(() => {
    refreshActivation();
  }, [refreshActivation]);

  /**
   * Activate License
   */
  const activateLicense = async ({
    licenseKey,
    fullName,
    mobile,
  }) => {

    try {

      const info = {

        isActivated: true,

        licenseKey,

        fullName,

        mobile,

        activatedOn: new Date().toISOString(),

      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.ACTIVATION_INFO,
        JSON.stringify(info)
      );

      setActivationInfo(info);

      return {
        success: true,
      };

    } catch (error) {

      console.log('Activation Error:', error);

      return {

        success: false,

        message: 'Unable to save activation.',

      };

    }

  };

  /**
   * Deactivate License
   */
  const deactivateLicense = async () => {

    try {

      await AsyncStorage.removeItem(
        STORAGE_KEYS.ACTIVATION_INFO
      );

      setActivationInfo(
        DEFAULT_ACTIVATION_INFO
      );

      return {

        success: true,

      };

    } catch (error) {

      console.log('Deactivate Error:', error);

      return {

        success: false,

        message: 'Unable to deactivate.',

      };

    }

  };

  /**
   * Update Activation Information
   * (Future-proof if you ever allow editing
   * name or mobile.)
   */
  const updateActivation = async (updates) => {

    try {

      const updated = {

        ...activationInfo,

        ...updates,

      };

      await AsyncStorage.setItem(

        STORAGE_KEYS.ACTIVATION_INFO,

        JSON.stringify(updated)

      );

      setActivationInfo(updated);

      return {

        success: true,

      };

    } catch (error) {

      console.log(error);

      return {

        success: false,

      };

    }

  };

  const value = {

    isLoading,

    isActivated: activationInfo.isActivated,

    activationInfo,

    activateLicense,

    deactivateLicense,

    refreshActivation,

    updateActivation,

  };

  return (

    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>

  );

};