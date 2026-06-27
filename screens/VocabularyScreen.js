import React from 'react';

import VocabularyWidget from '../widgets/VocabularyWidget';
import ContentScreen from '../layouts/ContentScreen';
import useRemoteData from '../hooks/useRemoteData';

const VOCABULARY_URL =
  'https://raw.githubusercontent.com/Meritto010/vocabulary-data/refs/heads/main/vocab.json';

export default function VocabularyScreen({ navigation }) {

  const remote = useRemoteData({
    url: VOCABULARY_URL,
    cacheKey: '@vocabulary_data_cache',
    premium: true,
    offline: true,
    showAlert: true,
  });

  return (
    <ContentScreen
      navigation={navigation}
      title="Vocabulary Builder"
      remote={remote}
      scroll={true}
      premiumMessage="Activate Premium to unlock the complete Vocabulary course."
      emptyTitle="No Vocabulary Content"
      emptyMessage="Vocabulary lessons are currently unavailable."
      renderContent={(data) => (
        <VocabularyWidget data={data} />
      )}
    />
  );

}