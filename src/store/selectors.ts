import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { Insurance } from './insuranceSlice';

export const selectProcedures = createSelector(
  (state: RootState) => state.procedures,
  ({ list, selectedIds }) => list.map((p) => ({ ...p, selected: !!selectedIds[p.id] }))
);

export const sumSelectedProceduresCost = createSelector(
  (state: RootState) => state.procedures,
  ({ list, selectedIds }) => {
    return Object.keys(selectedIds)
      .map((id) => list.find((p) => p.id === id))
      .filter((p) => !!p?.cost)
      .reduce((sum, p) => sum + p!.cost, 0);
  }
);

const _calculatePatientResponsibility = (
  insurance: Insurance | undefined,
  totalCost: number
): number => {
  if (totalCost <= 0) {
    return 0;
  }
  if (!insurance) {
    return totalCost;
  }

  const remainingDeductible = insurance.deductible;
  const remainingOop = Math.max(insurance.oopMax - (insurance.oopUsed ?? 0), 0);

  let patientCost = 0;
  let remainingCost = totalCost;

  // Apply deductible first
  const deductibleAmount = Math.min(remainingCost, remainingDeductible);
  patientCost += deductibleAmount;
  remainingCost -= deductibleAmount;

  // If there's still cost left, apply copay (once per encounter)
  if (remainingCost > 0 && insurance.copay > 0) {
    patientCost += insurance.copay;
    remainingCost -= insurance.copay;
    if (remainingCost < 0) remainingCost = 0;
  }

  // Apply coinsurance to the remaining amount after deductible and copay
  if (remainingCost > 0 && insurance.coInsurance > 0) {
    const coinsuranceAmount = remainingCost * (insurance.coInsurance / 100.0);
    patientCost += coinsuranceAmount;
  }

  // Patient never pays more than remaining out-of-pocket max
  return Math.min(patientCost, remainingOop);
};

export const patientResponsibilityAfterPrimary = createSelector(
  (state: RootState) => state.insurance.primary,
  sumSelectedProceduresCost,
  _calculatePatientResponsibility
);

export const primaryInsuranceResponsibility = createSelector(
  sumSelectedProceduresCost,
  patientResponsibilityAfterPrimary,
  (totalCost, patientResponsibility) => Math.max(totalCost - patientResponsibility, 0)
);

export const patientResponsibilityAfterSecondary = createSelector(
  (state: RootState) => state.insurance.secondary,
  patientResponsibilityAfterPrimary,
  _calculatePatientResponsibility
);

export const secondaryInsuranceResponsibility = createSelector(
  patientResponsibilityAfterPrimary,
  patientResponsibilityAfterSecondary,
  (primaryResponsibility, secondaryResponsibility) =>
    Math.max(primaryResponsibility - secondaryResponsibility, 0)
);

export const totalPatientResponsibilityBreakdown = createSelector(
  patientResponsibilityAfterSecondary,
  sumSelectedProceduresCost,
  (secondary, totalCost) => {
    return { total: secondary, percentage: totalCost > 0 ? (secondary / totalCost) * 100 : 0 };
  }
);

export const totalInsuranceResponsibilityBreakdown = createSelector(
  primaryInsuranceResponsibility,
  secondaryInsuranceResponsibility,
  sumSelectedProceduresCost,
  (primary, secondary, totalCost) => {
    const totalInsurance = primary + secondary;

    const percentage = totalCost > 0 ? (totalInsurance / totalCost) * 100 : 0;

    return { total: totalInsurance, percentage };
  }
);
