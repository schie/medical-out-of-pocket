import test from 'node:test';
import assert from 'node:assert/strict';
import reducer, {
  setPrimaryInsurance,
  updatePrimaryUsage,
  setSecondaryInsurance,
  updateSecondaryUsage,
  clearSecondaryInsurance,
  swapInsurances,
} from '../src/store/insuranceSlice';

const sampleIns = {
  name: 'A',
  deductible: 1000,
  oopMax: 5000,
  coInsurance: 0.2,
  copay: 50,
  usage: { deductibleUsed: 0, oopUsed: 0 },
};

test('setPrimaryInsurance replaces primary', () => {
  const state = reducer(undefined, setPrimaryInsurance(sampleIns));
  assert.equal(state.primary.name, 'A');
});

test('updatePrimaryUsage merges usage', () => {
  const state = reducer({ primary: sampleIns }, updatePrimaryUsage({ deductibleUsed: 200 }));
  assert.equal(state.primary.usage.deductibleUsed, 200);
});

test('setSecondaryInsurance sets secondary', () => {
  const state = reducer({ primary: sampleIns }, setSecondaryInsurance(sampleIns));
  assert.ok(state.secondary);
});

test('updateSecondaryUsage updates when secondary exists', () => {
  const state = reducer(
    { primary: sampleIns, secondary: sampleIns },
    updateSecondaryUsage({ oopUsed: 100 })
  );
  assert.equal(state.secondary!.usage.oopUsed, 100);
});

test('clearSecondaryInsurance removes secondary', () => {
  const state = reducer({ primary: sampleIns, secondary: sampleIns }, clearSecondaryInsurance());
  assert.equal(state.secondary, undefined);
});

test('swapInsurances swaps when secondary exists', () => {
  const state = reducer(
    { primary: { ...sampleIns, name: 'P' }, secondary: { ...sampleIns, name: 'S' } },
    swapInsurances()
  );
  assert.equal(state.primary.name, 'S');
  assert.equal(state.secondary!.name, 'P');
});

test('swapInsurances does nothing without secondary', () => {
  const state = reducer({ primary: sampleIns }, swapInsurances());
  assert.equal(state.primary.name, 'A');
  assert.equal(state.secondary, undefined);
});
