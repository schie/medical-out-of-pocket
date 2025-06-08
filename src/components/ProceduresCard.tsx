import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, Procedure } from '../store';
import { addProcedure } from '../store/proceduresSlice';
import ProcedureItem from './ProcedureItem';
import { selectProcedures } from '../store/selectors';
import useProcedureValidation from '../hooks/useProcedureValidation';
export default function ProceduresCard() {
  const dispatch = useDispatch<AppDispatch>();
  const procedures = useSelector(selectProcedures);

  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const { parsedCost, isInvalid } = useProcedureValidation(name, cost);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleCostChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCost(e.target.value);
  }, []);

  const resetAddForm = useCallback(() => {
    setName('');
    setCost('');
  }, []);

  const handleAdd = useCallback(() => {
    if (isInvalid) return;
    dispatch(addProcedure({ id: '', name, cost: parsedCost } as Procedure));
    resetAddForm();
  }, [isInvalid, parsedCost, name, dispatch, resetAddForm]);

  return (
    <div className="card bg-base-200 shadow-xl p-4 dark:shadow-white/20">
      <h2 className="card-title mb-4">
        <i aria-hidden="true" className="fa-solid fa-notes-medical mr-2" />
        Procedures
      </h2>
      <div className="join mb-2 items-start">
        <input
          type="text"
          placeholder="Name"
          className="input input-bordered join-item flex-1"
          value={name}
          onChange={handleNameChange}
        />
        <label className="input input-bordered validator join-item w-24">
          <span>$</span>
          <input
            type="number"
            placeholder="Cost"
            className="grow"
            min="0"
            value={cost}
            onChange={handleCostChange}
            required
          />
        </label>
        <button className="btn btn-primary join-item" onClick={handleAdd} disabled={isInvalid}>
          <i className="fa-solid fa-plus mr-1" aria-hidden="true" />
          Add
        </button>
      </div>
      <div className="max-h-111.5 overflow-y-auto">
        <ul className="space-y-2">
          {procedures.map((p) => (
            <ProcedureItem key={p.id} procedure={p} />
          ))}
        </ul>
      </div>
    </div>
  );
}
