import { combineReducers, createStore, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import mapSearch from './reducers/map-search';
import mapSavePlace from './reducers/map-save-place';

const reducers = combineReducers({
  mapsearch: mapSearch,
  mapsaveplace: mapSavePlace,
});
const persistConfig = {
  key: 'appfuxion-google-autocomplete',
  storage,
  whitelist: ['mapsaveplace'],
};

const composeEnhancer =
  // eslint-disable-next-line no-undef
  (process.env.NODE_ENV !== 'production' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null) ||
  compose;

const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(persistedReducer, composeEnhancer());
const persistor = persistStore(store);

export { reducers, persistedReducer, persistor };

export default store;
