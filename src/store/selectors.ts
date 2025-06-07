import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { Insurance } from './insuranceSlice';

export const selectProcedures = (state: RootState) => state.procedures.list;

export const sumSelectedProceduresCost = createSelector(
  (state: RootState) => state.procedures,
  ({ list, selectedIds }) => {
    return Object.keys(selectedIds)
      .map((id) => list.find((p) => p.id === id))
      .filter((p) => !!p?.cost)
      .reduce((sum, p) => sum + p!.cost, 0);
  },
);

const _calculatePatientResponsibility = (
  insurance: Insurance | undefined,
  totalCost: number,
): number => {
  if (totalCost <= 0) {
    return 0;
  }
  if (!insurance) {
    return totalCost;
  }

  const remainingDeductible = Math.max(insurance.deductible - insurance.usage.deductibleUsed, 0);
  const remainingOop = Math.max(insurance.oopMax - insurance.usage.oopUsed, 0);

  let patientCost = 0;
  let remainingCost = totalCost;

  const deductibleAmount = Math.min(remainingCost, remainingDeductible);
  patientCost += deductibleAmount;
  remainingCost -= deductibleAmount;

  if (remainingCost > 0) {
    patientCost += insurance.copay;
  }

  const coinsuranceAmount = remainingCost * insurance.coInsurance;
  patientCost += coinsuranceAmount;

  return Math.min(patientCost, remainingOop);
};

export const patientResponsibilityAfterPrimary = createSelector(
  (state: RootState) => state.insurance.primary,
  sumSelectedProceduresCost,
  _calculatePatientResponsibility,
);

export const patientResponsibilityAfterSecondary = createSelector(
  (state: RootState) => state.insurance.secondary,
  patientResponsibilityAfterPrimary,
  _calculatePatientResponsibility,
);
