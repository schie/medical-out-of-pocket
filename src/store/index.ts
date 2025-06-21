import { configureStore, combineReducers } from '@reduxjs/toolkit';

import proceduresReducer from './proceduresSlice';
import insuranceReducer from './insuranceSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  procedures: proceduresReducer,
  insurance: insuranceReducer,
});

export type RootReducer = typeof rootReducer;
export type RootState = ReturnType<RootReducer>;

export const store = configureStore({
  reducer: persistReducer<RootState>(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
// RootState is now exported above using the rootReducer type
export * from './selectors';

export type AppDispatch = typeof store.dispatch;
export type { Procedure, ProcedureCreate, ProcedureUpdate } from './proceduresSlice';
export type { Insurance } from './insuranceSlice';
