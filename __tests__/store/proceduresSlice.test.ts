import proceduresReducer, {
  addProcedure,
  removeProcedure,
  removeAllProcedures,
  toggleProcedure,
  toggleAllProcedures,
} from '../../src/store/proceduresSlice';

describe('proceduresSlice', () => {
  it('should return the initial state', () => {
    const result = proceduresReducer(undefined, { type: '' });
    expect(result).toEqual({
      list: [],
      selectedIds: {},
    });
  });

  describe('addProcedure', () => {
    it('should add a procedure', () => {
      const prevState = { list: [], selectedIds: {} as Record<string, boolean> };
      const action = addProcedure({ name: 'Proc', cost: 100 });
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.list.length).toBe(1);
      expect(nextState.list[0]).toEqual(
        expect.objectContaining({
          name: 'Proc',
          cost: 100,
          quantity: 1,
        })
      );
    });

    it('should generate a unique id when adding a procedure', () => {
      const prevState = { list: [], selectedIds: {} as Record<string, boolean> };
      const state1 = proceduresReducer(prevState, addProcedure({ name: 'A', cost: 100 }));
      const state2 = proceduresReducer(state1, addProcedure({ name: 'B', cost: 200 }));
      expect(state1.list[0].id).toBeDefined();
      expect(state2.list[1].id).toBeDefined();
      expect(state1.list[0].id).not.toBe(state2.list[1].id);
    });

    it('should select the newly added procedure by default', () => {
      const prevState = { list: [], selectedIds: {} as Record<string, boolean> };
      const action = addProcedure({ name: 'Proc', cost: 100 });
      const nextState = proceduresReducer(prevState, action);
      const newId = nextState.list[0].id;
      expect(nextState.selectedIds[newId]).toBe(true);
    });

    it('defaults quantity to 1 when not provided', () => {
      const prevState = { list: [], selectedIds: {} as Record<string, boolean> };
      const action = addProcedure({ name: 'NoQty', cost: 50 });
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.list[0].quantity).toBe(1);
    });
  });

  describe('updateProcedure', () => {
    it('should update a procedure', () => {
      const prevState = {
        list: [{ id: '1', name: 'Old', cost: 50, quantity: 1 }],
        selectedIds: {} as Record<string, boolean>,
      };
      const action = {
        type: 'procedures/updateProcedure',
        payload: { id: '1', name: 'New', cost: 200, quantity: 1 },
      };
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.list[0]).toEqual({
        id: '1',
        name: 'New',
        cost: 200, quantity: 1,
      });
    });

    it('should update quantity of a procedure', () => {
      const prevState = {
        list: [{ id: '1', name: 'Test', cost: 50, quantity: 1 }],
        selectedIds: {},
      };
      const action = {
        type: 'procedures/updateProcedure',
        payload: { id: '1', quantity: 5 },
      };
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.list[0]).toEqual({ id: '1', name: 'Test', cost: 50, quantity: 5 });
    });

    it('should not update a procedure if id does not exist', () => {
      const prevState = {
        list: [{ id: '1', name: 'A', cost: 10, quantity: 1 }],
        selectedIds: {},
      };
      const action = {
        type: 'procedures/updateProcedure',
        payload: { id: '2', name: 'B', cost: 20, quantity: 1 },
      };
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.list[0]).toEqual({ id: '1', name: 'A', cost: 10, quantity: 1 });
    });

    it('should not update name or cost if action.payload.name and action.payload.cost are undefined', () => {
      const prevState = {
        list: [{ id: '1', name: 'Original', cost: 123, quantity: 1 }],
        selectedIds: {},
      };
      const action = {
        type: 'procedures/updateProcedure',
        payload: { id: '1' }, // name and cost are undefined
      };
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.list[0]).toEqual({ id: '1', name: 'Original', cost: 123, quantity: 1 });
    });
  });

  describe('removeProcedure', () => {
    it('should remove a procedure', () => {
      const prevState = {
        list: [
          { id: '1', name: 'A', cost: 10, quantity: 1 },
          { id: '2', name: 'B', cost: 20, quantity: 1 },
        ],
        selectedIds: {} as Record<string, boolean>,
      };
      const action = removeProcedure('1');
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.list.length).toBe(1);
      expect(nextState.list[0].id).toBe('2');
    });

    it('should remove procedure from selectedIds when removed', () => {
      const prevState = {
        list: [{ id: '1', name: 'A', cost: 10, quantity: 1 }],
        selectedIds: { '1': true },
      };
      const action = removeProcedure('1');
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.selectedIds['1']).toBeUndefined();
    });

    it('should not fail when removing a procedure that does not exist', () => {
      const prevState = {
        list: [{ id: '1', name: 'A', cost: 10, quantity: 1 }],
        selectedIds: { '1': true },
      };
      const action = removeProcedure('2');
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.list.length).toBe(1);
      expect(nextState.selectedIds['1']).toBe(true);
    });
  });

  describe('removeAllProcedures', () => {
    it('should remove all procedures and clear selectedIds', () => {
      const prevState = {
        list: [
          { id: '1', name: 'A', cost: 10, quantity: 1 },
          { id: '2', name: 'B', cost: 20, quantity: 1 },
        ],
        selectedIds: { '1': true, '2': true },
      };
      const action = removeAllProcedures();
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.list.length).toBe(0);
      expect(nextState.selectedIds).toEqual({});
    });

    it('should not fail when list is already empty', () => {
      const prevState = { list: [], selectedIds: {} as Record<string, boolean> };
      const action = removeAllProcedures();
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.list.length).toBe(0);
      expect(nextState.selectedIds).toEqual({});
    });
  });

  describe('toggleProcedure', () => {
    it('should toggle a procedure selection on', () => {
      const prevState = {
        list: [{ id: '1', name: 'A', cost: 10, quantity: 1 }],
        selectedIds: {} as Record<string, boolean>,
      };
      const action = toggleProcedure('1');
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.selectedIds['1']).toBe(true);
    });

    it('should toggle a procedure selection off', () => {
      const prevState = {
        list: [{ id: '1', name: 'A', cost: 10, quantity: 1 }],
        selectedIds: { '1': true } as Record<string, boolean>,
      };
      const action = toggleProcedure('1');
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.selectedIds['1']).toBeUndefined();
    });

    it('should do nothing when toggling a procedure not in list', () => {
      const prevState = {
        list: [{ id: '1', name: 'A', cost: 10, quantity: 1 }],
        selectedIds: {},
      };
      const action = toggleProcedure('2');
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.selectedIds['2']).toBe(true);
    });

    it('should not throw when toggling a procedure id not in list', () => {
      const prevState = { list: [], selectedIds: {} as Record<string, boolean> };
      const action = toggleProcedure('nonexistent');
      expect(() => proceduresReducer(prevState, action)).not.toThrow();
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.selectedIds['nonexistent']).toBe(true);
    });
  });

  describe('toggleAllProcedures', () => {
    it('should toggle all procedures (select all)', () => {
      const prevState = {
        list: [
          { id: '1', name: 'A', cost: 10, quantity: 1 },
          { id: '2', name: 'B', cost: 20, quantity: 1 },
        ],
        selectedIds: {} as Record<string, boolean>,
      };
      const action = toggleAllProcedures();
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.selectedIds['1']).toBe(true);
      expect(nextState.selectedIds['2']).toBe(true);
    });

    it('should toggle all procedures (deselect all)', () => {
      const prevState = {
        list: [
          { id: '1', name: 'A', cost: 10, quantity: 1 },
          { id: '2', name: 'B', cost: 20, quantity: 1 },
        ],
        selectedIds: { '1': true, '2': true } as Record<string, boolean>,
      };
      const action = toggleAllProcedures();
      const nextState = proceduresReducer(prevState, action);
      expect(Object.keys(nextState.selectedIds).length).toBe(0);
    });

    it('should select all procedures if some are already selected', () => {
      const prevState = {
        list: [
          { id: '1', name: 'A', cost: 10, quantity: 1 },
          { id: '2', name: 'B', cost: 20, quantity: 1 },
        ],
        selectedIds: { '1': true },
      };
      const action = toggleAllProcedures();
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.selectedIds['1']).toBe(true);
      expect(nextState.selectedIds['2']).toBe(true);
    });

    it('should clear selectedIds when all are selected and toggleAllProcedures is called', () => {
      const prevState = {
        list: [
          { id: '1', name: 'A', cost: 10, quantity: 1 },
          { id: '2', name: 'B', cost: 20, quantity: 1 },
        ],
        selectedIds: { '1': true, '2': true },
      };
      const action = toggleAllProcedures();
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.selectedIds).toEqual({});
    });

    it('should not fail when toggling all procedures if list is empty', () => {
      const prevState = { list: [], selectedIds: {} as Record<string, boolean> };
      const action = toggleAllProcedures();
      const nextState = proceduresReducer(prevState, action);
      expect(nextState.selectedIds).toEqual({});
    });
  });
});
