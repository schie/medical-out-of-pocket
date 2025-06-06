import { configureStore } from '@reduxjs/toolkit';

import proceduresReducer from './proceduresSlice';
import insuranceReducer from './insuranceSlice';

export const store = configureStore({
  reducer: {
    procedures: proceduresReducer,
    insurance: insuranceReducer,
  },
});

export * from './selectors';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type { Procedure, ProcedureCreate, ProcedureUpdate } from './proceduresSlice';
export type { Insurance, InsuranceUsage } from './insuranceSlice';
