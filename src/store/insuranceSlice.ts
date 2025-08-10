import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Insurance {
  deductible: number;
  deductibleUsed: number;
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
  deductible: 0,
  deductibleUsed: 0,
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
    setSecondaryInsurance: (state, action: PayloadAction<Insurance>) => {
      state.secondary = action.payload;
    },
    clearPrimaryInsurance: (state) => {
      state.primary = { ...emptyInsurance };
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
  setSecondaryInsurance,
  clearPrimaryInsurance,
  clearSecondaryInsurance,
  swapInsurances,
} = insuranceSlice.actions;

export default insuranceSlice.reducer;
