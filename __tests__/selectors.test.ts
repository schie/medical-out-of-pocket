import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sumSelectedProceduresCost,
  patientResponsibilityAfterPrimary,
  patientResponsibilityAfterSecondary,
} from '../src/store';

import type { Procedure, RootState } from '../src/store';

const makeState = ({
  procedures = {
    list: [] as Procedure[],
    selectedIds: {} as Record<string, boolean>,
  },
  insurance = {
    primary: {
      name: 'Primary Insurance',
      deductible: 0,
      oopMax: 0,
      copay: 0,
      coInsurance: 0,
      usage: {
        deductibleUsed: 0,
        oopUsed: 0,
      },
    },
    secondary: undefined,
  },
} = {}): RootState => ({
  procedures,
  insurance,
});

test.describe('Selectors', () => {
  test.describe('sumSelectedProceduresCost', () => {
    test.it('returns 0 if no procedures are selected', () => {
      const state = makeState({
        procedures: {
          list: [{ id: '1', cost: 100, name: 'test' }],
          selectedIds: {} as Record<string, boolean>,
        },
      });
      assert.equal(sumSelectedProceduresCost(state), 0);
    });

    test.it('sums the cost of selected procedures', () => {
      const state = makeState({
        procedures: {
          list: [
            { id: '1', cost: 100, name: 'Procedure 1' },
            { id: '2', cost: 200, name: 'Procedure 2' },
            { id: '3', cost: 300, name: 'Procedure 3' },
          ],
          selectedIds: { '1': true, '3': true },
        },
      });
      assert.equal(sumSelectedProceduresCost(state), 400);
    });

    test.it('ignores procedures without cost', () => {
      const state = makeState({
        procedures: {
          list: [
            { id: '1', cost: 100, name: 'Procedure 1' },
            // @ts-expect-error: Intentionally omitting 'cost' to test selector behavior
            { id: '2', name: 'Procedure 2' },
            { id: '3', cost: 300, name: 'Procedure 3' },
          ],
          selectedIds: { '1': true, '2': true, '3': true },
        },
      });
      assert.equal(sumSelectedProceduresCost(state), 400);
    });

    const insurance = {
      name: 'Primary Insurance',
      deductible: 500,
      oopMax: 2000,
      copay: 20,
      coInsurance: 0.2,
      usage: {
        deductibleUsed: 100,
        oopUsed: 300,
      },
    };

    test.it('returns 0 if no procedures selected', () => {
      const state = makeState({
        procedures: {
          list: [{ id: '1', cost: 100, name: 'Procedure 1' }],
          selectedIds: {} as Record<string, boolean>,
        },
        insurance: {
          primary: insurance,
          secondary: undefined,
        },
      });
      assert.equal(patientResponsibilityAfterPrimary(state), 0);
    });

    test.it('returns total cost if no insurance', () => {
      const state = makeState({
        procedures: {
          list: [
            { id: '1', cost: 100, name: 'Procedure 1' },
            { id: '2', cost: 200, name: 'Procedure 2' },
          ],
          selectedIds: { '1': true, '2': true },
        },
        // @ts-expect-error: Intentionally omitting insurance to test selector behavior
        insurance: { primary: undefined },
      });
      assert.equal(patientResponsibilityAfterPrimary(state), 300);
    });

    test.it('calculates responsibility with insurance', () => {
      const state = makeState({
        procedures: {
          list: [
            { id: '1', cost: 100, name: 'Procedure 1' },
            { id: '2', cost: 200, name: 'Procedure 2' },
          ],
          selectedIds: { '1': true, '2': true },
        },
        insurance: { primary: insurance, secondary: undefined },
      });
      // total cost: 300, deductible left: 400
      // patient pays 300 (all goes to deductible)
      assert.equal(patientResponsibilityAfterPrimary(state), 300);
    });
    const primary = {
      name: 'Primary Insurance',
      deductible: 500,
      oopMax: 2000,
      copay: 20,
      coInsurance: 0.2,
      usage: {
        deductibleUsed: 500,
        oopUsed: 500,
      },
    };
    const secondary = {
      name: 'Secondary Insurance',
      deductible: 100,
      oopMax: 1000,
      copay: 10,
      coInsurance: 0.1,
      usage: {
        deductibleUsed: 0,
        oopUsed: 0,
      },
    };

    test.it('returns 0 if no procedures selected', () => {
      const state = makeState({
        procedures: {
          list: [{ id: '1', cost: 100, name: 'Procedure 1' }],
          selectedIds: {} as Record<string, boolean>,
        },
        // @ts-expect-error: Intentionally omitting secondary insurance to test selector behavior
        insurance: { primary, secondary },
      });
      assert.equal(patientResponsibilityAfterSecondary(state), 0);
    });

    test.it('applies secondary insurance to remaining responsibility', () => {
      const state = makeState({
        procedures: {
          list: [{ id: '1', cost: 500, name: 'Procedure 1' }],
          selectedIds: { '1': true },
        },
        // @ts-expect-error: Intentionally omitting secondary insurance to test selector behavior
        insurance: { primary, secondary },
      });
      // primary: deductible met, so copay + coinsurance: 20 + 0.2*500 = 120
      // secondary: deductible left 100, so pays 100, remaining 20, copay 10, coinsurance 0.1*20=2, total 100+10+2=112
      assert.equal(patientResponsibilityAfterSecondary(state), 112);
    });

    test.it('returns primary responsibility if no secondary insurance', () => {
      const state = makeState({
        procedures: {
          list: [{ id: '1', cost: 500, name: 'Procedure 1' }],
          selectedIds: { '1': true },
        },
        insurance: { primary, secondary: undefined },
      });
      // primary: 20 + 0.2*500 = 120
      assert.equal(
        patientResponsibilityAfterSecondary(state),
        patientResponsibilityAfterPrimary(state),
      );
    });
  });
});
