import reducer, {
  setPrimaryInsurance,
  setSecondaryInsurance,
  clearPrimaryInsurance,
  clearSecondaryInsurance,
  swapInsurances,
  Insurance,
} from '../../src/store/insuranceSlice';

const sampleIns: Insurance = {
  deductible: 1000,
  deductibleUsed: 0,
  oopMax: 5000,
  coInsurance: 0.2,
  copay: 50,
  oopUsed: 0,
};

describe('insuranceSlice reducer', () => {
  describe('setPrimaryInsurance', () => {
    it('replaces primary', () => {
      const state = reducer(undefined, setPrimaryInsurance(sampleIns));
      expect(state.primary.oopMax).toBe(5000);
    });

    it('works with undefined initial state', () => {
      const state = reducer(undefined, setPrimaryInsurance({ ...sampleIns, oopUsed: 123 }));
      expect(state.primary.oopUsed).toBe(123);
    });
  });

  describe('setSecondaryInsurance', () => {
    it('sets secondary', () => {
      const state = reducer({ primary: sampleIns }, setSecondaryInsurance(sampleIns));
      expect(state.secondary).toBeDefined();
    });
  });

  describe('clearPrimaryInsurance', () => {
    it('resets primary to empty values', () => {
      const state = reducer(
        { primary: sampleIns, secondary: sampleIns },
        clearPrimaryInsurance()
      );
      expect(state.primary).toEqual({
        deductible: 0,
        deductibleUsed: 0,
        oopMax: 0,
        coInsurance: 0,
        copay: 0,
        oopUsed: 0,
      });
      expect(state.secondary).toBeDefined();
    });
  });

  describe('clearSecondaryInsurance', () => {
    it('removes secondary', () => {
      const state = reducer(
        { primary: sampleIns, secondary: sampleIns },
        clearSecondaryInsurance()
      );
      expect(state.secondary).toBeUndefined();
    });

    it('does nothing if secondary is already undefined', () => {
      const state = reducer({ primary: sampleIns }, clearSecondaryInsurance());
      expect(state.secondary).toBeUndefined();
    });
  });

  describe('swapInsurances', () => {
    it('swaps when secondary exists', () => {
      const state = reducer(
        { primary: sampleIns, secondary: { ...sampleIns, copay: 10 } },
        swapInsurances()
      );
      expect(state.primary.copay).toBe(10);
      expect(state.secondary!.copay).toBe(50);
    });

    it('does nothing without secondary', () => {
      const state = reducer({ primary: sampleIns }, swapInsurances());
      expect(state.primary.oopMax).toBe(5000);
      expect(state.secondary).toBeUndefined();
    });

    it('swaps all fields between primary and secondary', () => {
      const primary = { ...sampleIns, deductible: 111, oopUsed: 1 };
      const secondary = { ...sampleIns, deductible: 222, oopUsed: 2 };
      const state = reducer({ primary, secondary }, swapInsurances());
      expect(state.primary.deductible).toBe(222);
      expect(state.primary.oopUsed).toBe(2);
      expect(state.secondary!.deductible).toBe(111);
      expect(state.secondary!.oopUsed).toBe(1);
    });
  });
});
