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
  usage: InsuranceUsage;
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
  usage: {
    deductibleUsed: 0,
    oopUsed: 0,
  },
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
    updatePrimaryUsage: (state, action: PayloadAction<Partial<InsuranceUsage>>) => {
      state.primary.usage = { ...state.primary.usage, ...action.payload };
    },
    setSecondaryInsurance: (state, action: PayloadAction<Insurance>) => {
      state.secondary = action.payload;
    },
    updateSecondaryUsage: (state, action: PayloadAction<Partial<InsuranceUsage>>) => {
      if (state.secondary) {
        state.secondary.usage = { ...state.secondary.usage, ...action.payload };
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
  updatePrimaryUsage,
  setSecondaryInsurance,
  updateSecondaryUsage,
  clearSecondaryInsurance,
  swapInsurances,
} = insuranceSlice.actions;

export default insuranceSlice.reducer;
