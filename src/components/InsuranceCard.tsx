import { useCallback, type ReactNode } from 'react';
import type { Insurance } from '../store';

interface InsuranceCardProps {
  label: string;
  insurance: Insurance;
  onChange: (insurance: Insurance) => void;
  cornerButton?: ReactNode;
}

export default function InsuranceCard({
  label,
  insurance,
  onChange,
  cornerButton,
}: InsuranceCardProps) {
  const updateInsuranceField = (
    insurance: Insurance,
    field: keyof Insurance | keyof Insurance['usage'],
    value: string | number,
    nestedField?: 'usage'
  ): Insurance => {
    if (nestedField) {
      return {
        ...insurance,
        [nestedField]: { ...insurance[nestedField], [field]: value },
      };
    }
    return { ...insurance, [field]: value };
  };

  const handleChange = useCallback(
    (field: keyof Insurance) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === 'name' ? e.target.value : Number(e.target.value);
      onChange(updateInsuranceField(insurance, field, value));
    },
    [insurance, onChange]
  );

  const handleUsageChange = useCallback(
    (field: keyof Insurance['usage']) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      onChange({
        ...insurance,
        usage: { ...insurance.usage, [field]: value },
      });
    },
    [insurance, onChange]
  );

  return (
    <div className="card bg-base-200 shadow-xl p-4 relative">
      {cornerButton && <div className="absolute right-2 top-2">{cornerButton}</div>}
      <h2 className="card-title mb-4">
        <i aria-hidden="true" className="fa-solid fa-shield-halved mr-2" />
        {label}
      </h2>
      <div className="flex flex-col gap-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Name</legend>
          <label className="input input-bordered flex items-center gap-2">
            <i aria-hidden="true" className="fa-solid fa-id-card opacity-50" />
            <input
              type="text"
              className="grow"
              value={insurance.name}
              onChange={handleChange('name')}
            />
          </label>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Deductible</legend>
          <label className="input input-bordered flex items-center gap-2">
            <span className="opacity-50">$</span>
            <input
              type="number"
              className="grow"
              min="0"
              value={insurance.deductible}
              onChange={handleChange('deductible')}
            />
          </label>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Out-of-pocket Max</legend>
          <label className="input input-bordered flex items-center gap-2">
            <span className="opacity-50">$</span>
            <input
              type="number"
              className="grow"
              min="0"
              value={insurance.oopMax}
              onChange={handleChange('oopMax')}
            />
          </label>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Copay</legend>
          <label className="input input-bordered flex items-center gap-2">
            <span className="opacity-50">$</span>
            <input
              type="number"
              className="grow"
              min="0"
              value={insurance.copay}
              onChange={handleChange('copay')}
            />
          </label>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Coinsurance</legend>
          <label className="input input-bordered flex items-center gap-2">
            <span className="opacity-50">%</span>
            <input
              type="number"
              className="grow"
              step="0.01"
              min="0"
              max="1"
              value={insurance.coInsurance}
              onChange={handleChange('coInsurance')}
            />
          </label>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Deductible Used</legend>
          <label className="input input-bordered flex items-center gap-2">
            <span className="opacity-50">$</span>
            <input
              type="number"
              className="grow"
              min="0"
              value={insurance.usage.deductibleUsed}
              onChange={handleUsageChange('deductibleUsed')}
            />
          </label>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">OOP Used</legend>
          <label className="input input-bordered flex items-center gap-2">
            <span className="opacity-50">$</span>
            <input
              type="number"
              className="grow"
              min="0"
              value={insurance.usage.oopUsed}
              onChange={handleUsageChange('oopUsed')}
            />
          </label>
        </fieldset>
      </div>
    </div>
  );
}
