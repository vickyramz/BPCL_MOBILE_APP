/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
 import RootNavigator from  '../CRM/RootController/RootNavigator'
 import {Provider} from 'react-redux'
 import { PersistGate } from 'redux-persist/lib/integration/react';
 import {store,persistor} from "./Container/store";
 import ErrorBoundary from 'react-native-error-boundary'
function App (props) {
  const CustomFallback = (propss) => (
    <View>
      <Text>Something happened!</Text>
      <Text>{propss.error.toString()}</Text>
      <Button  title={'Try again'} />
    </View>
  )
    return (
      <Provider store={store}>
         <PersistGate loading={null} persistor={persistor}>
         <ErrorBoundary FallbackComponent={CustomFallback}>
         <RootNavigator/>
         </ErrorBoundary>
         </PersistGate>      
      </Provider>
     
    );
  
}

export default App;
