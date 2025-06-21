import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { Insurance } from './insuranceSlice';

import { create, all } from 'mathjs';

const mathjs = create(all, {
  number: 'BigNumber',
  precision: 64,
});

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
      .reduce((sum, p) => mathjs.add(sum, p!.cost), 0);
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

  const { deductible, oopMax, oopUsed, copay, coInsurance } = insurance;

  const remainingOop = mathjs.max(mathjs.subtract(oopMax, oopUsed ?? 0), 0);

  const remainingDeductible = deductible;

  let patientCost = 0;
  let remainingCost = totalCost;

  // Apply deductible first
  const deductibleAmount = mathjs.min(remainingCost, remainingDeductible);
  patientCost = mathjs.add(patientCost, deductibleAmount);
  remainingCost = mathjs.subtract(remainingCost, deductibleAmount);

  // If there's still cost left, apply copay (once per encounter)
  if (remainingCost > 0 && copay > 0) {
    patientCost = mathjs.add(patientCost, copay);
    remainingCost = mathjs.subtract(remainingCost, copay);
    if (remainingCost < 0) {
      remainingCost = 0;
    }
  }

  // Apply coinsurance to the remaining amount after deductible and copay
  if (remainingCost > 0 && coInsurance > 0) {
    let coinsuranceAmount = mathjs.multiply(remainingCost, coInsurance);
    coinsuranceAmount = mathjs.divide(coinsuranceAmount, 100); // Convert percentage to decimal
    patientCost = mathjs.add(patientCost, coinsuranceAmount);
  }

  // Patient never pays more than remaining out-of-pocket max
  return mathjs.min(patientCost, remainingOop);
};

export const patientResponsibilityAfterPrimary = createSelector(
  (state: RootState) => state.insurance.primary,
  sumSelectedProceduresCost,
  _calculatePatientResponsibility
);

export const primaryInsuranceResponsibility = createSelector(
  sumSelectedProceduresCost,
  patientResponsibilityAfterPrimary,
  (totalCost, patientResponsibility) =>
    mathjs.max(mathjs.subtract(totalCost, patientResponsibility), 0)
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
    mathjs.max(mathjs.subtract(primaryResponsibility, secondaryResponsibility), 0)
);

export const totalPatientResponsibilityBreakdown = createSelector(
  patientResponsibilityAfterSecondary,
  sumSelectedProceduresCost,
  (secondary, totalCost) => {
    return {
      total: secondary,
      percentage: totalCost > 0 ? mathjs.multiply(100.0, mathjs.divide(secondary, totalCost)) : 0,
    };
  }
);

export const totalInsuranceResponsibilityBreakdown = createSelector(
  primaryInsuranceResponsibility,
  secondaryInsuranceResponsibility,
  sumSelectedProceduresCost,
  (primary, secondary, totalCost) => {
    const totalInsurance = primary + secondary;

    const percentage =
      totalCost > 0 ? mathjs.multiply(100, mathjs.divide(totalInsurance, totalCost)) : 0;

    return { total: totalInsurance, percentage };
  }
);
