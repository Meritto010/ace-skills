import React from 'react';

import AppHeader from '../components/AppHeader';
import ScreenContainer from '../components/ScreenContainer';

export default function ViewerScreen({

  navigation,

  title,

  children,

  scroll = false,

  backgroundColor = '#FFFFFF',

  contentStyle = {},

}) {

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

        {children}

      </ScreenContainer>

    </>

  );

}