import { useSelector } from 'react-redux';
import ProcedureItem from './ProcedureItem';
import AddProcedure from './AddProcedure';
import { selectProcedures } from '../store/selectors';

export default function ProceduresCard() {
  const procedures = useSelector(selectProcedures);
  return (
    <div className="card bg-base-200 shadow-xl p-4 dark:shadow-white/20">
      <h2 className="card-title mb-4">
        <i aria-hidden="true" className="fa-solid fa-notes-medical mr-2" />
        Procedures
      </h2>
      <AddProcedure />
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
