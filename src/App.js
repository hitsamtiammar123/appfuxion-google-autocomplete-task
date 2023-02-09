import React from 'react';
import './App.scss';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import { Body } from 'layouts';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Body />
      </PersistGate>
    </Provider>
  );
}

export default App;
