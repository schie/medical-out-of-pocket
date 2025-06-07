import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch, Procedure } from '../store';
import { addProcedure } from '../store/proceduresSlice';
import ProcedureItem from './ProcedureItem';
import { selectProcedures } from '../store/selectors';
export default function ProceduresCard() {
  const dispatch = useDispatch<AppDispatch>();
  const procedures = useSelector(selectProcedures);

  const [name, setName] = useState('');
  const [cost, setCost] = useState('');

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

  const resetAddForm = useCallback(() => {
    setName('');
    setCost('');
  }, []);

  const handleAdd = useCallback(() => {
    const parsedCost = parseFloat(cost);
    if (!name || isNaN(parsedCost)) return;
    dispatch(addProcedure({ id: '', name, cost: parsedCost } as Procedure));
    resetAddForm();
  }, [cost, name, dispatch, resetAddForm]);

  return (
    <div className="card bg-base-200 shadow-xl p-4">
      <h2 className="card-title mb-4">Procedures</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Name"
          className="input input-bordered flex-1"
          value={name}
          onChange={handleNameChange}
        />
        <input
          type="number"
          placeholder="Cost"
          className="input input-bordered w-24"
          value={cost}
          onChange={handleCostChange}
        />
        <button className="btn btn-primary" onClick={handleAdd}>
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {procedures.map((p) => (
          <ProcedureItem key={p.id} procedure={p} />
        ))}
      </ul>
    </div>
  );
}

