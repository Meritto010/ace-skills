import React from 'react';

import { useAuth } from '../context/AuthContext';

import AppHeader from '../components/AppHeader';
import ScreenContainer from '../components/ScreenContainer';
import ScreenLoader from '../components/ScreenLoader';
import PremiumGate from '../components/PremiumGate';
import ErrorView from '../components/ErrorView';
import EmptyView from '../components/EmptyView';

export default function ContentScreen({

  navigation,

  title,

  remote,

  renderContent,

  scroll = false,

  backgroundColor = '#FFFFFF',

  contentStyle = {},

  emptyTitle = 'No Content Available',

  emptyMessage = 'There is nothing to display.',

  premiumMessage = 'Activate Premium Membership to access this content.',

}) {

  const { isActivated } = useAuth();

  const {
    data,
    loading,
    error,
    retry,
  } = remote;

  // Premium Check
  if (!isActivated) {
    return (
      <PremiumGate
        navigation={navigation}
        title={title}
        message={premiumMessage}
      />
    );
  }

  // Loading
  if (loading) {
    return (
      <ScreenLoader
        message={`Loading ${title}...`}
      />
    );
  }

  // Error
  if (error && !data) {
    return (
      <ErrorView
        title="Unable to Load Content"
        message="Please check your internet connection and try again."
        buttonText="Retry"
        onRetry={retry}
      />
    );
  }

  // Empty Data
  const isEmpty =
    data == null ||
    (Array.isArray(data) && data.length === 0);

  if (isEmpty) {
    return (
      <EmptyView
        title={emptyTitle}
        message={emptyMessage}
      />
    );
  }

  // Content
  return (
    <>
      <AppHeader
        navigation={navigation}
        title={title}
      />

      <ScreenContainer
        scroll={scroll}
        backgroundColor={backgroundColor}
        contentStyle={contentStyle}
      >
        {renderContent(data)}
      </ScreenContainer>
    </>
  );

}