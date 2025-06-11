import test from 'node:test';
import assert from 'node:assert/strict';
import reducer, {
  setPrimaryInsurance,
  updatePrimaryOOPUsage,
  setSecondaryInsurance,
  updateSecondaryOOPUsage,
  clearSecondaryInsurance,
  swapInsurances,
} from '../src/store/insuranceSlice';

const sampleIns = {
  deductible: 1000,
  oopMax: 5000,
  coInsurance: 0.2,
  copay: 50,
  oopUsed: 0,
};

test('setPrimaryInsurance replaces primary', () => {
  const state = reducer(undefined, setPrimaryInsurance(sampleIns));
  assert.equal(state.primary.oopMax, 5000);
});

test('updatePrimaryOOPUsage merges usage', () => {
  const state = reducer({ primary: sampleIns }, updatePrimaryOOPUsage(200));
  assert.equal(state.primary.oopUsed, 200);
});

test('setSecondaryInsurance sets secondary', () => {
  const state = reducer({ primary: sampleIns }, setSecondaryInsurance(sampleIns));
  assert.ok(state.secondary);
});

test('updateSecondaryOOPUsage updates when secondary exists', () => {
  const state = reducer({ primary: sampleIns, secondary: sampleIns }, updateSecondaryOOPUsage(100));
  assert.equal(state.secondary!.oopUsed, 100);
});

test('clearSecondaryInsurance removes secondary', () => {
  const state = reducer({ primary: sampleIns, secondary: sampleIns }, clearSecondaryInsurance());
  assert.equal(state.secondary, undefined);
});

test('swapInsurances swaps when secondary exists', () => {
  const state = reducer(
    { primary: sampleIns, secondary: { ...sampleIns, copay: 10 } },
    swapInsurances()
  );
  assert.strictEqual(state.primary.copay, 10);
  assert.strictEqual(state.secondary!.copay, 50);
});

test('swapInsurances does nothing without secondary', () => {
  const state = reducer({ primary: sampleIns }, swapInsurances());
  assert.strictEqual(state.primary.oopMax, 5000);
  assert.equal(state.secondary, undefined);
});
