import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import ProcedureItem from './ProcedureItem';
import AddProcedure from './AddProcedure';
import { selectProcedures } from '../store/selectors';
import { removeAllProcedures } from '../store/proceduresSlice';
import type { AppDispatch } from '../store';

export default function ProceduresCard() {
  const procedures = useSelector(selectProcedures);
  const dispatch = useDispatch<AppDispatch>();
  const handleRemoveAll = useCallback(
    () => dispatch(removeAllProcedures()),
    [dispatch]
  );

  return (
    <div className="card bg-base-200 shadow-xl p-4 relative dark:shadow-white/20">
      {procedures.length > 0 && (
        <button
          className="btn btn-circle btn-xs btn-error absolute right-2 top-2"
          onClick={handleRemoveAll}
          aria-label="Remove All Procedures"
        >
          <i className="fa-solid fa-trash" aria-hidden="true" />
        </button>
      )}
      <h2 className="card-title mb-4">
        <i aria-hidden="true" className="fa-solid fa-notes-medical mr-2" />
        Procedures
      </h2>
      <AddProcedure />
      {procedures.length === 0 ? (
        <p className="text-center text-base-content/60 mt-4" data-testid="no-procedures-msg">
          No procedures added yet. Use the form above to add one.
        </p>
      ) : (
        <div className="max-h-111.5 overflow-y-auto">
          <ul className="space-y-2">
            {procedures.map((p) => (
              <ProcedureItem key={p.id} procedure={p} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
