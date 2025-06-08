import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch, Procedure } from '../store';
import { updateProcedure, removeProcedure } from '../store/proceduresSlice';
import useProcedureValidation from '../hooks/useProcedureValidation';

interface ProcedureItemProps {
  procedure: Procedure;
}

export default function ProcedureItem({ procedure }: ProcedureItemProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(procedure.name);
  const [cost, setCost] = useState(procedure.cost.toString());
  const { parsedCost, isInvalid, errorMessage } = useProcedureValidation(
    name,
    cost,
  );

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

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    [],
  );

  const handleCostChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCost(e.target.value);
    },
    [],
  );

  return (
    <li className="flex items-center gap-2 text-left">
      {isEditing ? (
        <>
          <input
            type="text"
            className="input input-bordered flex-1"
            value={name}
            onChange={handleNameChange}
          />
          <input
            type="number"
            className="input input-bordered w-24"
            min="0"
            value={cost}
            onChange={handleCostChange}
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={saveEdit}
            disabled={isInvalid}
          >
            <i className="fa-solid fa-floppy-disk mr-1" aria-hidden="true" />Save
          </button>
          <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>
            <i className="fa-solid fa-xmark mr-1" aria-hidden="true" />Cancel
          </button>
          {errorMessage && (
            <p className="text-error text-sm">{errorMessage}</p>
          )}
        </>
      ) : (
        <>
          <span className="flex-1">
            {procedure.name} - ${procedure.cost.toFixed(2)}
          </span>
          <button className="btn btn-sm" onClick={startEdit}>
            <i className="fa-solid fa-pen mr-1" aria-hidden="true" />Edit
          </button>
          <button className="btn btn-error btn-sm" onClick={remove}>
            <i className="fa-solid fa-trash mr-1" aria-hidden="true" />Remove
          </button>
        </>
      )}
    </li>
  );
}

