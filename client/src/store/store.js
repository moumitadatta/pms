// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    // your custom middleware here
  ),
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;