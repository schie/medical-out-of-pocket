import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch, Procedure } from '../store';
import { updateProcedure, removeProcedure, toggleProcedure } from '../store/proceduresSlice';
import useProcedureValidation from '../hooks/useProcedureValidation';

interface ProcedureItemProps {
  procedure: Procedure & { selected?: boolean };
}

export default function ProcedureItem({ procedure }: ProcedureItemProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(procedure.name);
  const [cost, setCost] = useState(procedure.cost.toString());
  const { parsedCost, isInvalid, errorMessage } = useProcedureValidation(name, cost);

  const startEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setName(procedure.name);
    setCost(procedure.cost.toString());
  }, [procedure.cost, procedure.name]);

  const saveEdit = useCallback(() => {
    if (isInvalid) return;
    dispatch(updateProcedure({ id: procedure.id, name, cost: parsedCost }));
    setIsEditing(false);
  }, [dispatch, isInvalid, parsedCost, name, procedure.id]);

  const remove = useCallback(() => {
    dispatch(removeProcedure(procedure.id));
  }, [dispatch, procedure.id]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleCostChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCost(e.target.value);
  }, []);

  const handleToggle = useCallback(() => {
    dispatch(toggleProcedure(procedure.id));
  }, [dispatch, procedure.id]);

  return (
    <li className="flex items-center gap-2 text-left">
      {isEditing ? (
        <>
          <div className="join flex-1">
            <input
              type="text"
              className="input input-bordered join-item flex-1"
              value={name}
              onChange={handleNameChange}
            />
            <label className="input input-bordered validator join-item w-24">
              <span>$</span>
              <input
                type="number"
                className="grow"
                min="0"
                value={cost}
                onChange={handleCostChange}
                required
              />
            </label>
          </div>
          <button
            className="btn btn-primary btn-sm join-item"
            onClick={saveEdit}
            disabled={isInvalid}
          >
            <i className="fa-solid fa-floppy-disk mr-1" aria-hidden="true" />
            Save
          </button>
          <button className="btn btn-ghost btn-sm join-item" onClick={cancelEdit}>
            <i className="fa-solid fa-xmark mr-1" aria-hidden="true" />
            Cancel
          </button>
          {errorMessage && <div className="validator-hint text-error text-sm">{errorMessage}</div>}
        </>
      ) : (
        <>
          <input
            type="checkbox"
            className="checkbox"
            checked={procedure.selected}
            onChange={handleToggle}
          />
          <span className="flex-1/2">{procedure.name}</span>
          <span className="flex-1/6">${procedure.cost.toFixed(2)}</span>
          <button className="btn btn-xs" onClick={startEdit}>
            <i className="fa-solid fa-pen" aria-hidden="true" />
          </button>
          <button className="btn btn-error btn-xs" onClick={remove}>
            <i className="fa-solid fa-trash" aria-hidden="true" />
          </button>
        </>
      )}
    </li>
  );
}
