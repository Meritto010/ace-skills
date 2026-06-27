import React from 'react';

import GrammarWidget from '../widgets/GrammarWidget';
import ContentScreen from '../layouts/ContentScreen';
import useRemoteData from '../hooks/useRemoteData';

const GRAMMAR_URL =
  'https://raw.githubusercontent.com/Meritto010/grammar-data/refs/heads/main/grammar.json';

export default function GrammarScreen({ navigation }) {

  const remote = useRemoteData({
    url: GRAMMAR_URL,
    cacheKey: '@grammar_cache',
    premium: true,
    offline: true,
    showAlert: true,
  });

  return (
    <ContentScreen
      navigation={navigation}
      title="Grammar Mastery"
      remote={remote}
      scroll={true}
      renderContent={(data) => (
        <GrammarWidget data={data} />
      )}
    />
  );

}