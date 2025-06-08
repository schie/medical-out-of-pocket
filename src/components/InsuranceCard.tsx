import { useCallback } from 'react';
import type { Insurance } from '../store';

interface InsuranceCardProps {
  label: string;
  insurance: Insurance;
  onChange: (insurance: Insurance) => void;
}

export default function InsuranceCard({ label, insurance, onChange }: InsuranceCardProps) {
  const handleChange = useCallback(
    (field: keyof Insurance) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === 'name' ? e.target.value : Number(e.target.value);
      onChange({ ...insurance, [field]: value });
    },
    [insurance, onChange],
  );

  const handleUsageChange = useCallback(
    (field: keyof Insurance['usage']) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      onChange({
        ...insurance,
        usage: { ...insurance.usage, [field]: value },
      });
    },
    [insurance, onChange],
  );

  return (
    <div className="card bg-base-200 shadow-xl p-4">
      <h2 className="card-title mb-4">
        <i aria-hidden="true" className="fa-solid fa-shield-halved mr-2" />
        {label}
      </h2>
      <div className="flex flex-col gap-2">
        <label className="input input-bordered flex items-center gap-2">
          <i aria-hidden="true" className="fa-solid fa-id-card opacity-50" />
          <input
            type="text"
            className="grow"
            placeholder="Name"
            value={insurance.name}
            onChange={handleChange('name')}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <span className="opacity-50">$</span>
          <input
            type="number"
            className="grow"
            placeholder="Deductible"
            min="0"
            value={insurance.deductible}
            onChange={handleChange('deductible')}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <span className="opacity-50">$</span>
          <input
            type="number"
            className="grow"
            placeholder="Out-of-pocket Max"
            min="0"
            value={insurance.oopMax}
            onChange={handleChange('oopMax')}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <span className="opacity-50">$</span>
          <input
            type="number"
            className="grow"
            placeholder="Copay"
            min="0"
            value={insurance.copay}
            onChange={handleChange('copay')}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <span className="opacity-50">%</span>
          <input
            type="number"
            className="grow"
            placeholder="Coinsurance"
            step="0.01"
            min="0"
            max="1"
            value={insurance.coInsurance}
            onChange={handleChange('coInsurance')}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <span className="opacity-50">$</span>
          <input
            type="number"
            className="grow"
            placeholder="Deductible Used"
            min="0"
            value={insurance.usage.deductibleUsed}
            onChange={handleUsageChange('deductibleUsed')}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <span className="opacity-50">$</span>
          <input
            type="number"
            className="grow"
            placeholder="OOP Used"
            min="0"
            value={insurance.usage.oopUsed}
            onChange={handleUsageChange('oopUsed')}
          />
        </label>
      </div>
    </div>
  );
}
