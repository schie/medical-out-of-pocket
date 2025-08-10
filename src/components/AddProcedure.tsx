import { useState, useCallback, useEffect, type FC } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { addProcedure } from '../store/proceduresSlice';
import useProcedureValidation from '../hooks/useProcedureValidation';
import CPTs from './_cpt.json';
import Fuse, { type FuseResult } from 'fuse.js';

const fuse = new Fuse(CPTs, {
  keys: ['code', 'label'],
});

interface SearchListItemProps {
  code: string;
  label: string;
  onNameChange: (name: string) => void;
}

const SearchListItem: FC<SearchListItemProps> = ({ code, label, onNameChange }) => {
  const onClick = useCallback(
    () => onNameChange(`${code} - ${label}`),
    [label, code, onNameChange]
  );
  return (
    <li>
      <button type="button" className="w-full text-left" onClick={onClick}>
        <span className="font-mono text-xs text-base-content/60">{code}</span>
        <span className="ml-2">{label}</span>
      </button>
    </li>
  );
};

interface SearchResultProps {
  name: string;
  onNameChange: (name: string) => void;
}
const SearchList: FC<SearchResultProps> = ({ name, onNameChange }) => {
  const [searchResults, setSearchResults] = useState<FuseResult<{ code: string; label: string }>[]>(
    []
  );

  useEffect(() => {
    const results = fuse.search(name);
    setSearchResults(results);
  }, [name]);

  return (
    <ul className="dropdown-content z-[1] menu menu-sm bg-base-100 w-full mt-1 max-h-60 overflow-auto shadow-lg shadow-base-300 rounded-box">
      {searchResults.slice(0, 8).map(({ item }) => (
        <SearchListItem
          key={item.code}
          code={item.code}
          label={item.label}
          onNameChange={onNameChange}
        />
      ))}
    </ul>
  );
};

export const AddProcedure = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const { parsedCost, isInvalid } = useProcedureValidation(name, cost);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setName(name);
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
    dispatch(addProcedure({ name, cost: parsedCost }));
    resetAddForm();
  }, [isInvalid, parsedCost, name, dispatch, resetAddForm]);
  return (
    <div className="join mb-2 items-start w-full">
      <div className="dropdown join-item flex-1">
        <label tabIndex={0} className="input input-bordered flex items-center gap-2 w-full">
          <span className="opacity-50">
            <i className="fa-solid fa-search mr-1" aria-hidden="true" />
          </span>
          <input
            type="search"
            placeholder="Name"
            className="grow"
            value={name}
            onChange={handleNameChange}
            autoComplete="off"
            tabIndex={0}
          />
        </label>
        {name && <SearchList name={name} onNameChange={setName} />}
      </div>
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
  );
};

export default AddProcedure;
