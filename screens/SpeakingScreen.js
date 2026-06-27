import React from 'react';

import SpeakingWidget from '../widgets/SpeakingWidget';
import ContentScreen from '../layouts/ContentScreen';
import useRemoteData from '../hooks/useRemoteData';

const SPEAKING_URL =
  'https://raw.githubusercontent.com/Meritto010/speaking-data/refs/heads/main/speaking.json';

export default function SpeakingScreen({ navigation }) {

  const remote = useRemoteData({
    url: SPEAKING_URL,
    cacheKey: '@speaking_data_cache',
    premium: true,
    offline: true,
    showAlert: true,
  });

  return (
    <ContentScreen
      navigation={navigation}
      title="Speaking Lab"
      remote={remote}
      scroll={true}
      premiumMessage="Activate Premium to unlock the complete Speaking course."
      emptyTitle="No Speaking Content"
      emptyMessage="Speaking lessons are currently unavailable."
      renderContent={(data) => (
        <SpeakingWidget data={data} />
      )}
    />
  );

}