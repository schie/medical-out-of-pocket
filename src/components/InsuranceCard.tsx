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
    field: keyof Insurance,
    value: number
  ): Insurance => {
    return { ...insurance, [field]: value };
  };

  const handleChange = useCallback(
    (field: keyof Insurance) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      onChange(updateInsuranceField(insurance, field, value));
    },
    [insurance, onChange]
  );

  return (
    <div className="card bg-base-200 shadow-xl p-4 relative dark:shadow-white/20">
      {cornerButton && <div className="absolute right-2 top-2">{cornerButton}</div>}
      <h2 className="card-title mb-4">
        <i aria-hidden="true" className="fa-solid fa-shield-halved mr-2" />
        {label}
      </h2>
      <div className="flex flex-col gap-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Deductible</legend>
          <label className="input input-bordered flex items-center gap-2 w-full">
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
          <legend className="fieldset-legend">Copay</legend>
          <label className="input input-bordered flex items-center gap-2 w-full">
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
          <label className="input input-bordered flex items-center gap-2 w-full">
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

        <div className="flex flex-row gap-4">
          <fieldset className="fieldset flex-1">
            <legend className="fieldset-legend">Out-of-pocket Max</legend>
            <label className="input input-bordered flex items-center gap-2 w-full">
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
          <fieldset className="fieldset flex-1">
            <legend className="fieldset-legend">OOP Used</legend>
            <label className="input input-bordered flex items-center gap-2 w-full">
              <span className="opacity-50">$</span>
              <input
                type="number"
                className="grow"
                min="0"
                value={insurance.oopUsed}
                onChange={handleChange('oopUsed')}
              />
            </label>
          </fieldset>
        </div>
        <input
          type="range"
          min={0}
          max={insurance.oopMax}
          value={insurance.oopUsed}
          className="range w-full"
          onChange={handleChange('oopUsed')}
        />
      </div>
    </div>
  );
}
