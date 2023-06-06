import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userReducer } from './reducers/UserSlice';
import { eventsReducer } from './reducers/EventsSlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { userEventsReducer } from './reducers/UserEventsSlice';

const rootReducer = combineReducers({
  // settings: settingsReducer,
  user: userReducer,
  events: eventsReducer,
  userEvents: userEventsReducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // blacklist: ['users'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const setupStore = () => store;

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
