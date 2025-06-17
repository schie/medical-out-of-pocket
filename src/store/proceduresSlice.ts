import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Procedure {
  id: string;
  name: string;
  cost: number;
}

export type ProcedureCreate = Omit<Procedure, 'id'>;
export type ProcedureUpdate = Partial<Procedure> & { id: string };

export interface ProceduresState {
  list: Procedure[];
  selectedIds: { [id: string]: boolean };
}

const initialState: ProceduresState = {
  list: [],
  selectedIds: {},
};

const proceduresSlice = createSlice({
  name: 'procedures',
  initialState,
  reducers: {
    addProcedure: (state, action: PayloadAction<Procedure>) => {
      const id = crypto.randomUUID();
      state.list.push({ ...action.payload, id });
      state.selectedIds[id] = true; // Initialize as not selected
    },
    updateProcedure: (
      state,
      action: PayloadAction<{ id: string; name?: string; cost?: number }>
    ) => {
      const { id, name, cost } = action.payload;
      const procedure = state.list.find((p) => p.id === id);
      if (procedure) {
        if (name !== undefined) procedure.name = name;
        if (cost !== undefined) procedure.cost = cost;
      }
    },
    removeProcedure: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
      delete state.selectedIds[action.payload]; // Remove from selectedIds
    },
    toggleProcedure: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedIds[id]) {
        delete state.selectedIds[id];
      } else {
        state.selectedIds[id] = true;
      }
    },
    toggleAllProcedures: (state) => {
      if (Object.keys(state.selectedIds).length === state.list.length) {
        // If all are selected, clear selection
        state.selectedIds = {};
      } else {
        // Otherwise, select all
        state.selectedIds = Object.fromEntries(state.list.map((p) => [p.id, true]));
      }
    },
    setProcedures: (state, action: PayloadAction<ProcedureCreate[]>) => {
      state.list = action.payload.map((p) => ({ ...p, id: crypto.randomUUID() }));
      state.selectedIds = Object.fromEntries(state.list.map((p) => [p.id, true]));
    },
  },
});

export const {
  addProcedure,
  updateProcedure,
  removeProcedure,
  toggleProcedure,
  toggleAllProcedures,
  setProcedures,
} = proceduresSlice.actions;

export default proceduresSlice.reducer;
