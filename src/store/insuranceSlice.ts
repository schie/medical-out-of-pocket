import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface InsuranceUsage {
  deductibleUsed: number;
  oopUsed: number;
}

export interface Insurance {
  name: string;
  deductible: number;
  oopMax: number;
  coInsurance: number;
  copay: number;
  oopUsed?: number;
}

interface InsuranceState {
  primary: Insurance;
  secondary?: Insurance;
}

const emptyInsurance: Insurance = {
  name: '',
  deductible: 0,
  oopMax: 0,
  coInsurance: 0,
  copay: 0,
  oopUsed: 0,
};

const initialState: InsuranceState = {
  primary: emptyInsurance,
};

const insuranceSlice = createSlice({
  name: 'insurance',
  initialState,
  reducers: {
    setPrimaryInsurance: (state, action: PayloadAction<Insurance>) => {
      state.primary = action.payload;
    },
    updatePrimaryOOPUsage: (state, action: PayloadAction<number>) => {
      state.primary.oopUsed = action.payload;
    },
    setSecondaryInsurance: (state, action: PayloadAction<Insurance>) => {
      state.secondary = action.payload;
    },
    updateSecondaryOOPUsage: (state, action: PayloadAction<number>) => {
      if (state.secondary) {
        state.secondary.oopUsed = action.payload;
      }
    },
    clearSecondaryInsurance: (state) => {
      state.secondary = undefined;
    },
    swapInsurances: (state) => {
      if (state.secondary) {
        const temp = state.primary;
        state.primary = state.secondary;
        state.secondary = temp;
      }
    },
  },
});

export const {
  setPrimaryInsurance,
  updatePrimaryOOPUsage,
  setSecondaryInsurance,
  updateSecondaryOOPUsage,
  clearSecondaryInsurance,
  swapInsurances,
} = insuranceSlice.actions;

export default insuranceSlice.reducer;
