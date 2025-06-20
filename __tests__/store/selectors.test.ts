import type { RootState } from '../../src/store';
import {
  patientResponsibilityAfterPrimary,
  selectProcedures,
  sumSelectedProceduresCost,
  patientResponsibilityAfterSecondary,
  secondaryInsuranceResponsibility,
  primaryInsuranceResponsibility,
  totalPatientResponsibilityBreakdown,
  totalInsuranceResponsibilityBreakdown,
} from '../../src/store/selectors';

const selectors = {
  patientResponsibilityAfterPrimary,
  selectProcedures,
  sumSelectedProceduresCost,
  patientResponsibilityAfterSecondary,
  secondaryInsuranceResponsibility,
  primaryInsuranceResponsibility,
  totalPatientResponsibilityBreakdown,
  totalInsuranceResponsibilityBreakdown,
};

describe('selectors', () => {
  describe('selectProcedures', () => {
    it('returns procedures with selected property set correctly', () => {
      const state: RootState = {
        insurance: {
          primary: {
            deductible: 0,
            copay: 0,
            coInsurance: 0,
            oopMax: 0,
            oopUsed: 0,
          },
          secondary: undefined,
        },
        procedures: {
          list: [
            { id: '1', name: 'Procedure 1', cost: 100 },
            { id: '2', name: 'Procedure 2', cost: 200 },
            { id: '3', name: 'Procedure 3', cost: 300 },
          ],
          selectedIds: { '1': true, '3': true },
        },
      };
      expect(selectProcedures(state)).toEqual([
        { id: '1', name: 'Procedure 1', cost: 100, selected: true },
        { id: '2', name: 'Procedure 2', cost: 200, selected: false },
        { id: '3', name: 'Procedure 3', cost: 300, selected: true },
      ]);
    });

    it('returns all procedures as not selected if selectedIds is empty', () => {
      const state: RootState = {
        procedures: {
          list: [
            { id: '1', name: 'Procedure 1', cost: 100 },
            { id: '2', name: 'Procedure 2', cost: 200 },
          ],
          selectedIds: {},
        },
        insurance: {
          primary: {
            deductible: 0,
            copay: 0,
            coInsurance: 0,
            oopMax: 0,
            oopUsed: 0,
          },
          secondary: undefined,
        },
      };
      expect(selectProcedures(state)).toEqual([
        { id: '1', name: 'Procedure 1', cost: 100, selected: false },
        { id: '2', name: 'Procedure 2', cost: 200, selected: false },
      ]);
    });

    it('returns an empty array if procedures list is empty', () => {
      const state: RootState = {
        insurance: {
          primary: {
            deductible: 0,
            copay: 0,
            coInsurance: 0,
            oopMax: 0,
            oopUsed: 0,
          },
        },
        procedures: { list: [], selectedIds: {} },
      };
      expect(selectProcedures(state)).toEqual([]);
    });
  });

  describe('sumSelectedProceduresCost', () => {
    it('sums the cost of selected procedures', () => {
      const state: RootState = {
        insurance: {
          primary: {
            deductible: 0,
            copay: 0,
            coInsurance: 0,
            oopMax: 0,
            oopUsed: 0,
          },
        },
        procedures: {
          list: [
            { id: '1', name: 'Procedure 1', cost: 100 },
            { id: '2', name: 'Procedure 2', cost: 200 },
            { id: '3', name: 'Procedure 3', cost: 300 },
          ],
          selectedIds: { '1': true, '3': true },
        },
      };
      expect(sumSelectedProceduresCost(state)).toBe(400);
    });

    it('returns 0 if no procedures are selected', () => {
      const state: RootState = {
        insurance: {
          primary: {
            deductible: 0,
            copay: 0,
            coInsurance: 0,
            oopMax: 0,
            oopUsed: 0,
          },
        },
        procedures: {
          list: [
            { id: '1', name: 'Procedure 1', cost: 100 },
            { id: '2', name: 'Procedure 2', cost: 200 },
          ],
          selectedIds: {},
        },
      };
      expect(sumSelectedProceduresCost(state)).toBe(0);
    });

    it('ignores procedures with undefined or zero cost', () => {
      const state: RootState = {
        insurance: {
          primary: {
            deductible: 0,
            copay: 0,
            coInsurance: 0,
            oopMax: 0,
            oopUsed: 0,
          },
        },
        procedures: {
          list: [
            { id: '1', name: 'Procedure 1', cost: 0 },
            { id: '3', name: 'Procedure 3', cost: 300 },
          ],
          selectedIds: { '1': true, '2': true, '3': true },
        },
      };
      expect(sumSelectedProceduresCost(state)).toBe(300);
    });

    it('returns 0 if procedures list is empty', () => {
      const state: RootState = {
        procedures: { list: [], selectedIds: { '1': true } },
        insurance: {
          primary: {
            deductible: 0,
            copay: 0,
            coInsurance: 0,
            oopMax: 0,
            oopUsed: 0,
          },
        },
      };
      expect(sumSelectedProceduresCost(state)).toBe(0);
    });

    it('returns 0 if selectedIds refer to non-existent procedures', () => {
      const state: RootState = {
        insurance: {
          primary: {
            deductible: 0,
            copay: 0,
            coInsurance: 0,
            oopMax: 0,
            oopUsed: 0,
          },
        },
        procedures: {
          list: [{ id: '1', name: 'Procedure 1', cost: 100 }],
          selectedIds: { '2': true },
        },
      };
      expect(sumSelectedProceduresCost(state)).toBe(0);
    });
  });

  describe('patientResponsibilityAfterPrimary', () => {
    const getState = (
      insurance: RootState['insurance']['primary'],
      procedures: RootState['procedures']
    ) => ({
      insurance: { primary: insurance, secondary: undefined },
      procedures,
    });

    it('returns 0 if total cost is 0', () => {
      const procedures = {
        list: [
          { id: '1', name: 'A', cost: 0 },
          { id: '2', name: 'B', cost: 0 },
        ],
        selectedIds: { '1': true, '2': true },
      };
      const insurance = {
        deductible: 500,
        copay: 20,
        coInsurance: 20,
        oopMax: 1000,
        oopUsed: 0,
      };
      const state = getState(insurance, procedures);
      expect(patientResponsibilityAfterPrimary(state)).toBe(0);
    });

    it('applies deductible only if total cost <= deductible', () => {
      const procedures = {
        list: [
          { id: '1', name: 'A', cost: 100 },
          { id: '2', name: 'B', cost: 50 },
        ],
        selectedIds: { '1': true, '2': true },
      };
      const insurance = {
        deductible: 200,
        copay: 30,
        coInsurance: 50,
        oopMax: 1000,
        oopUsed: 0,
      };
      const state = getState(insurance, procedures);
      expect(patientResponsibilityAfterPrimary(state)).toBe(150);
    });

    it('applies deductible, copay, and coinsurance', () => {
      const procedures = {
        list: [{ id: '1', name: 'A', cost: 300 }],
        selectedIds: { '1': true },
      };
      const insurance = {
        deductible: 100,
        copay: 20,
        coInsurance: 50,
        oopMax: 1000,
        oopUsed: 0,
      };
      expect(patientResponsibilityAfterPrimary(getState(insurance, procedures))).toBe(210);
    });

    it('does not exceed out-of-pocket max', () => {
      const procedures = {
        list: [{ id: '1', name: 'A', cost: 2000 }],
        selectedIds: { '1': true },
      };
      const insurance = {
        deductible: 500,
        copay: 100,
        coInsurance: 50,
        oopMax: 600,
        oopUsed: 0,
      };
      expect(patientResponsibilityAfterPrimary(getState(insurance, procedures))).toBe(600);
    });

    it('subtracts oopUsed from oopMax', () => {
      const procedures = {
        list: [{ id: '1', name: 'A', cost: 2000 }],
        selectedIds: { '1': true },
      };
      const insurance = {
        deductible: 500,
        copay: 100,
        coInsurance: 50,
        oopMax: 1000,
        oopUsed: 800,
      };
      expect(patientResponsibilityAfterPrimary(getState(insurance, procedures))).toBe(200);
    });

    it('handles zero copay and coinsurance', () => {
      const procedures = {
        list: [{ id: '1', name: 'A', cost: 300 }],
        selectedIds: { '1': true },
      };
      const insurance = {
        deductible: 100,
        copay: 0,
        coInsurance: 0,
        oopMax: 1000,
        oopUsed: 0,
      };
      expect(patientResponsibilityAfterPrimary(getState(insurance, procedures))).toBe(100);
    });

    it('handles missing oopUsed as 0', () => {
      const procedures = {
        list: [{ id: '1', name: 'A', cost: 1000 }],
        selectedIds: { '1': true },
      };
      const insurance = {
        deductible: 100,
        copay: 50,
        coInsurance: 10,
        oopMax: 500,
      };
      expect(
        patientResponsibilityAfterPrimary(getState(insurance, procedures))
      ).toBeLessThanOrEqual(500);
    });
  });

  describe('patientResponsibilityAfterSecondary', () => {
    const getState = (
      primary: RootState['insurance']['primary'],
      secondary: RootState['insurance']['secondary'],
      procedures: RootState['procedures']
    ) => ({
      insurance: { primary, secondary },
      procedures,
    });

    it('returns patient responsibility after secondary insurance', () => {
      const procedures = {
        list: [
          { id: '1', name: 'A', cost: 500 },
          { id: '2', name: 'B', cost: 500 },
        ],
        selectedIds: { '1': true, '2': true },
      };
      const primary = {
        deductible: 200,
        copay: 50,
        coInsurance: 20,
        oopMax: 1000,
        oopUsed: 0,
      };
      const secondary = {
        deductible: 100,
        copay: 20,
        coInsurance: 10,
        oopMax: 500,
        oopUsed: 0,
      };
      expect(
        patientResponsibilityAfterSecondary(getState(primary, secondary, procedures))
      ).toBeCloseTo(148, 0);
    });

    it('returns 0 if no secondary insurance and patient responsibility after primary is 0', () => {
      const procedures = {
        list: [
          { id: '1', name: 'A', cost: 0 },
          { id: '2', name: 'B', cost: 0 },
        ],
        selectedIds: { '1': true, '2': true },
      };
      const primary = {
        deductible: 100,
        copay: 10,
        coInsurance: 10,
        oopMax: 1000,
        oopUsed: 0,
      };
      expect(patientResponsibilityAfterSecondary(getState(primary, undefined, procedures))).toBe(0);
    });

    it('returns patient responsibility after primary if no secondary insurance', () => {
      const procedures = {
        list: [
          { id: '1', name: 'A', cost: 100 },
          { id: '2', name: 'B', cost: 200 },
        ],
        selectedIds: { '1': true, '2': true },
      };
      const primary = {
        deductible: 50,
        copay: 20,
        coInsurance: 10,
        oopMax: 1000,
        oopUsed: 0,
      };
      const state = getState(primary, undefined, procedures);
      expect(patientResponsibilityAfterSecondary(state)).toBe(
        patientResponsibilityAfterPrimary(state)
      );
    });

    it('does not exceed secondary out-of-pocket max', () => {
      const procedures = {
        list: [{ id: '1', name: 'A', cost: 2000 }],
        selectedIds: { '1': true },
      };
      const primary = {
        deductible: 500,
        copay: 100,
        coInsurance: 50,
        oopMax: 2000,
        oopUsed: 0,
      };
      const secondary = {
        deductible: 100,
        copay: 50,
        coInsurance: 50,
        oopMax: 100,
        oopUsed: 0,
      };
      expect(
        patientResponsibilityAfterSecondary(getState(primary, secondary, procedures))
      ).toBeLessThanOrEqual(100);
    });

    it('subtracts oopUsed from secondary oopMax', () => {
      const procedures = {
        list: [{ id: '1', name: 'A', cost: 1000 }],
        selectedIds: { '1': true },
      };
      const primary = {
        deductible: 100,
        copay: 50,
        coInsurance: 10,
        oopMax: 500,
        oopUsed: 0,
      };
      const secondary = {
        deductible: 100,
        copay: 50,
        coInsurance: 10,
        oopMax: 200,
        oopUsed: 150,
      };
      expect(
        patientResponsibilityAfterSecondary(getState(primary, secondary, procedures))
      ).toBeLessThanOrEqual(50);
    });

    it('handles zero copay and coinsurance for secondary', () => {
      const procedures = {
        list: [{ id: '1', name: 'A', cost: 300 }],
        selectedIds: { '1': true },
      };
      const primary = {
        deductible: 100,
        copay: 0,
        coInsurance: 0,
        oopMax: 1000,
        oopUsed: 0,
      };
      const secondary = {
        deductible: 50,
        copay: 0,
        coInsurance: 0,
        oopMax: 1000,
        oopUsed: 0,
      };
      expect(patientResponsibilityAfterSecondary(getState(primary, secondary, procedures))).toBe(
        50
      );
    });

    it('handles missing oopUsed as 0 for secondary', () => {
      const procedures = {
        list: [{ id: '1', name: 'A', cost: 1000 }],
        selectedIds: { '1': true },
      };
      const primary = {
        deductible: 100,
        copay: 50,
        coInsurance: 10,
        oopMax: 500,
        oopUsed: 0,
      };
      const secondary = {
        deductible: 100,
        copay: 50,
        coInsurance: 10,
        oopMax: 200,
      };
      expect(
        patientResponsibilityAfterSecondary(getState(primary, secondary, procedures))
      ).toBeLessThanOrEqual(200);
    });
  });

  describe('secondaryInsuranceResponsibility', () => {
    const getState = (
      primary: RootState['insurance']['primary'],
      secondary: RootState['insurance']['secondary'],
      procedures: RootState['procedures']
    ) => ({
      insurance: { primary, secondary },
      procedures,
    });

    it('returns the difference between patient responsibility after primary and after secondary', () => {
      const procedures = {
        list: [
          { id: '1', name: 'A', cost: 500 },
          { id: '2', name: 'B', cost: 500 },
        ],
        selectedIds: { '1': true, '2': true },
      };
      const primary = {
        deductible: 200,
        copay: 50,
        coInsurance: 20,
        oopMax: 1000,
        oopUsed: 0,
      };
      const secondary = {
        deductible: 100,
        copay: 20,
        coInsurance: 10,
        oopMax: 500,
        oopUsed: 0,
      };
      expect(
        secondaryInsuranceResponsibility(getState(primary, secondary, procedures))
      ).toBeCloseTo(252, 0);
    });

    it('returns 0 if patient responsibility after secondary equals after primary', () => {
      const procedures = {
        list: [
          { id: '1', name: 'A', cost: 100 },
          { id: '2', name: 'B', cost: 200 },
        ],
        selectedIds: {},
      };
      const primary = {
        deductible: 50,
        copay: 20,
        coInsurance: 10,
        oopMax: 1000,
        oopUsed: 0,
      };
      const secondary = {
        deductible: 50,
        copay: 10,
        coInsurance: 10,
        oopMax: 500,
        oopUsed: 0,
      };
      expect(secondaryInsuranceResponsibility(getState(primary, secondary, procedures))).toBe(0);
    });

    it('does not return negative values', () => {
      const procedures = {
        list: [{ id: '1', name: 'A', cost: 100 }],
        selectedIds: { '1': true },
      };
      const primary = {
        deductible: 100,
        copay: 0,
        coInsurance: 0,
        oopMax: 100,
        oopUsed: 0,
      };
      const secondary = {
        deductible: 200,
        copay: 0,
        coInsurance: 0,
        oopMax: 200,
        oopUsed: 0,
      };
      expect(secondaryInsuranceResponsibility(getState(primary, secondary, procedures))).toBe(0);
    });

    it('handles missing oopUsed as 0 for secondary', () => {
      const procedures = {
        list: [{ id: '1', name: 'A', cost: 1000 }],
        selectedIds: { '1': true },
      };
      const primary = {
        deductible: 100,
        copay: 50,
        coInsurance: 10,
        oopMax: 500,
        oopUsed: 0,
      };
      const secondary = {
        deductible: 100,
        copay: 50,
        coInsurance: 10,
        oopMax: 200,
      };
      expect(
        secondaryInsuranceResponsibility(getState(primary, secondary, procedures))
      ).toBeLessThanOrEqual(500);
    });

    it('returns 0 if no procedures are selected', () => {
      const procedures = {
        list: [
          { id: '1', name: 'A', cost: 100 },
          { id: '2', name: 'B', cost: 200 },
        ],
        selectedIds: {},
      };
      const primary = {
        deductible: 50,
        copay: 20,
        coInsurance: 10,
        oopMax: 1000,
        oopUsed: 0,
      };
      const secondary = {
        deductible: 50,
        copay: 10,
        coInsurance: 10,
        oopMax: 500,
        oopUsed: 0,
      };
      expect(secondaryInsuranceResponsibility(getState(primary, secondary, procedures))).toBe(0);
    });
  });
  describe('primaryInsuranceResponsibility', () => {
    const getState = (
      insurance: RootState['insurance'],
      procedures: RootState['procedures']
    ): RootState => ({
      insurance,
      procedures,
    });

    it('returns 0 if no procedures are selected', () => {
      const procedures = {
        list: [
          { id: '1', name: 'A', cost: 100 },
          { id: '2', name: 'B', cost: 200 },
        ],
        selectedIds: {},
      };
      const insurance = {
        deductible: 100,
        copay: 20,
        coInsurance: 10,
        oopMax: 1000,
        oopUsed: 0,
      };
      expect(primaryInsuranceResponsibility(getState({ primary: insurance }, procedures))).toBe(0);
    });

    it('returns 0 if patient responsibility equals total cost', () => {
      const procedures = {
        list: [
          { id: '1', name: 'A', cost: 100 },
          { id: '2', name: 'B', cost: 200 },
        ],
        selectedIds: { '1': true, '2': true },
      };

      const insurance = {
        primary: {
          deductible: 300,
          copay: 0,
          coInsurance: 0,
          oopMax: 1000,
          oopUsed: 0,
        },
      };
      // No insurance, so patient pays all
      expect(primaryInsuranceResponsibility(getState(insurance, procedures))).toBe(0);
    });

    it('returns total cost minus patient responsibility', () => {
      const procedures = {
        list: [
          { id: '1', name: 'A', cost: 500 },
          { id: '2', name: 'B', cost: 500 },
        ],
        selectedIds: { '1': true, '2': true },
      };
      const primary = {
        deductible: 200,
        copay: 50,
        coInsurance: 20,
        oopMax: 1000,
        oopUsed: 0,
      };
      const totalCost = selectors.sumSelectedProceduresCost(getState({ primary }, procedures));
      const patientResp = selectors.patientResponsibilityAfterPrimary(
        getState({ primary }, procedures)
      );
      expect(selectors.primaryInsuranceResponsibility(getState({ primary }, procedures))).toBe(
        totalCost - patientResp
      );
    });

    it('never returns negative value', () => {
      const procedures = {
        list: [{ id: '1', name: 'A', cost: 100 }],
        selectedIds: { '1': true },
      };
      const primary = {
        deductible: 200,
        copay: 0,
        coInsurance: 0,
        oopMax: 100,
        oopUsed: 0,
      };
      expect(primaryInsuranceResponsibility(getState({ primary }, procedures))).toBe(0);
    });

    it('handles missing oopUsed as 0', () => {
      const procedures = {
        list: [{ id: '1', name: 'A', cost: 1000 }],
        selectedIds: { '1': true },
      };
      const primary = {
        deductible: 100,
        copay: 50,
        coInsurance: 10,
        oopMax: 500,
      };
      const state = getState({ primary }, procedures);
      const totalCost = sumSelectedProceduresCost(state);
      const patientResp = patientResponsibilityAfterPrimary(state);
      expect(primaryInsuranceResponsibility(state)).toBe(totalCost - patientResp);
    });
  });

  describe('totalPatientResponsibilityBreakdown', () => {
    const getState = (
      primary: RootState['insurance']['primary'],
      secondary: RootState['insurance']['secondary'],
      procedures: RootState['procedures']
    ) => ({
      insurance: { primary, secondary },
      procedures,
    });

    it('returns correct total and percentage when secondary insurance reduces patient responsibility', () => {
      const procedures = {
        list: [
          { id: '1', name: 'A', cost: 500 },
          { id: '2', name: 'B', cost: 500 },
        ],
        selectedIds: { '1': true, '2': true },
      };
      const primary = {
        deductible: 200,
        copay: 50,
        coInsurance: 20,
        oopMax: 1000,
        oopUsed: 0,
      };
      const secondary = {
        deductible: 100,
        copay: 20,
        coInsurance: 10,
        oopMax: 500,
        oopUsed: 0,
      };
      const state = getState(primary, secondary, procedures);
      const result = selectors.totalPatientResponsibilityBreakdown(state);
      expect(result.total).toBeCloseTo(148, 0);
      expect(result.percentage).toBeCloseTo(14.8, 1);
    });
    it('returns 0 total and 0 percentage if no procedures are selected', () => {
      const procedures = {
        list: [
          { id: '1', name: 'A', cost: 100 },
          { id: '2', name: 'B', cost: 200 },
        ],
        selectedIds: {},
      };
      const primary = {
        deductible: 50,
        copay: 20,
        coInsurance: 10,
        oopMax: 1000,
        oopUsed: 0,
      };
      const secondary = {
        deductible: 50,
        copay: 10,
        coInsurance: 10,
        oopMax: 500,
        oopUsed: 0,
      };
      const state = getState(primary, secondary, procedures);
      const result = selectors.totalPatientResponsibilityBreakdown(state);
      expect(result.total).toBe(0);
      expect(result.percentage).toBe(0);
    });
    it('returns correct total and percentage when there is no secondary insurance', () => {
      const procedures = {
        list: [
          { id: '1', name: 'A', cost: 100 },
          { id: '2', name: 'B', cost: 200 },
        ],
        selectedIds: { '1': true, '2': true },
      };
      const primary = {
        deductible: 50,
        copay: 20,
        coInsurance: 10,
        oopMax: 1000,
        oopUsed: 0,
      };
      const state = getState(primary, undefined, procedures);
      const result = selectors.totalPatientResponsibilityBreakdown(state);
      const expectedTotal = selectors.patientResponsibilityAfterPrimary(state);
      expect(result.total).toBe(expectedTotal);
    });
    it('handles missing oopUsed as 0 for secondary insurance', () => {
      const procedures = {
        list: [{ id: '1', name: 'A', cost: 1000 }],
        selectedIds: { '1': true },
      };
      const primary = {
        deductible: 100,
        copay: 50,
        coInsurance: 10,
        oopMax: 500,
        oopUsed: 0,
      };
      const secondary = {
        deductible: 100,
        copay: 50,
        coInsurance: 10,
        oopMax: 200,
      };
      const state = getState(primary, secondary, procedures);
      const result = selectors.totalPatientResponsibilityBreakdown(state);
      expect(result.total).toBeLessThanOrEqual(200);
      expect(result.percentage).toBeLessThanOrEqual(20);
    });

    it('returns correct total and percentage when both insurances pay', () => {
      const procedures = {
        list: [
          { id: '1', name: 'A', cost: 500 },
          { id: '2', name: 'B', cost: 500 },
        ],
        selectedIds: { '1': true, '2': true },
      };
      const primary = {
        deductible: 200,
        copay: 50,
        coInsurance: 20,
        oopMax: 1000,
        oopUsed: 0,
      };
      const secondary = {
        deductible: 100,
        copay: 20,
        coInsurance: 10,
        oopMax: 500,
        oopUsed: 0,
      };
      const state = getState(primary, secondary, procedures);
      const result = selectors.totalInsuranceResponsibilityBreakdown(state);
      expect(result.total).toBe(852);
      expect(result.percentage).toBe(85.2);
    });

    it('returns 0 total and 0 percentage if no procedures are selected', () => {
      const procedures = {
        list: [
          { id: '1', name: 'A', cost: 100 },
          { id: '2', name: 'B', cost: 200 },
        ],
        selectedIds: {},
      };
      const primary = {
        deductible: 50,
        copay: 20,
        coInsurance: 10,
        oopMax: 1000,
        oopUsed: 0,
      };
      const secondary = {
        deductible: 50,
        copay: 10,
        coInsurance: 10,
        oopMax: 500,
        oopUsed: 0,
      };
      const state = getState(primary, secondary, procedures);
      const result = selectors.totalInsuranceResponsibilityBreakdown(state);
      expect(result.total).toBe(0);
      expect(result.percentage).toBe(0);
    });

    it('returns correct total and percentage when there is no secondary insurance', () => {
      const procedures = {
        list: [
          { id: '1', name: 'A', cost: 100 },
          { id: '2', name: 'B', cost: 200 },
        ],
        selectedIds: { '1': true, '2': true },
      };
      const primary = {
        deductible: 50,
        copay: 20,
        coInsurance: 10,
        oopMax: 1000,
        oopUsed: 0,
      };
      const state = getState(primary, undefined, procedures);
      const expectedPrimary = selectors.primaryInsuranceResponsibility(state);
      const expectedSecondary = selectors.secondaryInsuranceResponsibility(state);
      const expectedTotalCost = selectors.sumSelectedProceduresCost(state);
      const result = selectors.totalInsuranceResponsibilityBreakdown(state);
      expect(result.total).toBe(expectedPrimary + expectedSecondary);
      expect(result.percentage).toBe(
        expectedTotalCost > 0
          ? ((expectedPrimary + expectedSecondary) / expectedTotalCost) * 100
          : 0
      );
    });

    it('handles missing oopUsed as 0 for secondary insurance', () => {
      const procedures = {
        list: [{ id: '1', name: 'A', cost: 1000 }],
        selectedIds: { '1': true },
      };
      const primary = {
        deductible: 100,
        copay: 50,
        coInsurance: 10,
        oopMax: 500,
        oopUsed: 0,
      };

      const result = selectors.totalInsuranceResponsibilityBreakdown({
        insurance: { primary },
        procedures,
      });
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.percentage).toBeLessThanOrEqual(100 * (result.total / 1000));
    });

    it('never returns negative total or percentage', () => {
      const procedures = {
        list: [{ id: '1', name: 'A', cost: 100 }],
        selectedIds: { '1': true },
      };
      const primary = {
        deductible: 200,
        copay: 0,
        coInsurance: 0,
        oopMax: 100,
        oopUsed: 0,
      };
      const result = selectors.totalInsuranceResponsibilityBreakdown({
        procedures,
        insurance: { primary },
      });
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.percentage).toBeGreaterThanOrEqual(0);
    });
  });
});
