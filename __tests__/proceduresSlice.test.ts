import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import proceduresReducer, {
  addProcedure,
  removeProcedure,
  toggleProcedure,
  toggleAllProcedures,
} from '../src/store/proceduresSlice';

describe('proceduresSlice', () => {
  let originalCrypto: typeof global.crypto;

  beforeEach(() => {
    // Save and mock crypto.randomUUID for deterministic tests
    originalCrypto = global.crypto;
    global.crypto = {
      randomUUID: () => 'test-id',
    } as unknown as Crypto;
  });

  afterEach(() => {
    // Restore original crypto
    global.crypto = originalCrypto;
  });

  it('should return the initial state', () => {
    const result = proceduresReducer(undefined, { type: '' });
    assert.deepStrictEqual(result, {
      list: [],
      selectedIds: {},
    });
  });

  it('should add a procedure', () => {
    const prevState = { list: [], selectedIds: {} as Record<string, boolean> };
    const action = addProcedure({ id: 'ignored', name: 'Proc', cost: 100 });
    const nextState = proceduresReducer(prevState, action);
    assert.strictEqual(nextState.list.length, 1);
    assert.deepStrictEqual(nextState.list[0], {
      id: 'test-id',
      name: 'Proc',
      cost: 100,
    });
  });

  it('should update a procedure', () => {
    const prevState = {
      list: [{ id: '1', name: 'Old', cost: 50 }],
      selectedIds: {} as Record<string, boolean>,
    };
    const action = {
      type: 'procedures/updateProcedure',
      payload: { id: '1', name: 'New', cost: 200 },
    };
    const nextState = proceduresReducer(prevState, action);
    assert.deepStrictEqual(nextState.list[0], {
      id: '1',
      name: 'New',
      cost: 200,
    });
  });

  it('should remove a procedure', () => {
    const prevState = {
      list: [
        { id: '1', name: 'A', cost: 10 },
        { id: '2', name: 'B', cost: 20 },
      ],
      selectedIds: {} as Record<string, boolean>,
    };
    const action = removeProcedure('1');
    const nextState = proceduresReducer(prevState, action);
    assert.strictEqual(nextState.list.length, 1);
    assert.strictEqual(nextState.list[0].id, '2');
  });

  it('should toggle a procedure selection on', () => {
    const prevState = {
      list: [{ id: '1', name: 'A', cost: 10 }],
      selectedIds: {} as Record<string, boolean>,
    };
    const action = toggleProcedure('1');
    const nextState = proceduresReducer(prevState, action);
    assert.strictEqual(nextState.selectedIds['1'], true);
  });

  it('should toggle a procedure selection off', () => {
    const prevState = {
      list: [{ id: '1', name: 'A', cost: 10 }],
      selectedIds: { '1': true } as Record<string, boolean>,
    };
    const action = toggleProcedure('1');
    const nextState = proceduresReducer(prevState, action);
    assert.strictEqual(nextState.selectedIds['1'], undefined);
  });

  it('should toggle all procedures (select all)', () => {
    const prevState = {
      list: [
        { id: '1', name: 'A', cost: 10 },
        { id: '2', name: 'B', cost: 20 },
      ],
      selectedIds: {} as Record<string, boolean>,
    };
    const action = toggleAllProcedures();
    const nextState = proceduresReducer(prevState, action);
    assert.strictEqual(nextState.selectedIds['1'], true);
    assert.strictEqual(nextState.selectedIds['2'], true);
  });

  it('should toggle all procedures (deselect all)', () => {
    const prevState = {
      list: [
        { id: '1', name: 'A', cost: 10 },
        { id: '2', name: 'B', cost: 20 },
      ],
      selectedIds: { '1': true, '2': true } as Record<string, boolean>,
    };
    const action = toggleAllProcedures();
    const nextState = proceduresReducer(prevState, action);
    assert.strictEqual(Object.keys(nextState.selectedIds).length, 0);
  });
});
