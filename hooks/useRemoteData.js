import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '../context/AuthContext';

export default function useRemoteData({

  url,

  cacheKey = null,

  premium = true,

  offline = true,

  showAlert = true,

  timeout = 15000,

}) {

  const { isActivated } = useAuth();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(null);

  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = useCallback(async (isRefresh = false) => {

    if (premium && !isActivated) {

      setLoading(false);

      return;

    }

    if (isRefresh) {

      setRefreshing(true);

    } else {

      setLoading(true);

    }

    setError(null);

    try {

      const controller = new AbortController();

      const timer = setTimeout(() => {

        controller.abort();

      }, timeout);

      const response = await fetch(url, {

        signal: controller.signal,

      });

      clearTimeout(timer);

      if (!response.ok) {

        throw new Error('Unable to download content.');

      }

      const json = await response.json();

      setData(json);

      setLastUpdated(new Date());

      if (offline && cacheKey) {

        await AsyncStorage.setItem(

          cacheKey,

          JSON.stringify(json)

        );

      }

    } catch (err) {

      if (offline && cacheKey) {

        try {

          const cached = await AsyncStorage.getItem(cacheKey);

          if (cached) {

            setData(JSON.parse(cached));

          } else {

            throw err;

          }

        } catch {

          setError(err);

          if (showAlert) {

            Alert.alert(

              'Connection Error',

              'Unable to load content.'

            );

          }

        }

      } else {

        setError(err);

        if (showAlert) {

          Alert.alert(

            'Connection Error',

            'Unable to load content.'

          );

        }

      }

    } finally {

      setLoading(false);

      setRefreshing(false);

    }

  }, [

    url,

    cacheKey,

    offline,

    premium,

    showAlert,

    timeout,

    isActivated,

  ]);

  useEffect(() => {

    loadData();

  }, [

    loadData,

  ]);

  return {

    data,

    loading,

    refreshing,

    error,

    lastUpdated,

    refresh: () => loadData(true),

    retry: () => loadData(false),

  };

}