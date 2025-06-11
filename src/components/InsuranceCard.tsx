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
          <legend className="fieldset-legend flex items-center gap-2">
            Deductible
            <div
              className="tooltip tooltip-right"
              data-tip="The amount you pay before insurance starts covering costs."
            >
              <i aria-hidden="true" className="fa-solid fa-circle-info text-info cursor-pointer" />
            </div>
          </legend>
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
          <legend className="fieldset-legend flex items-center gap-2">
            Copay
            <div
              className="tooltip tooltip-right"
              data-tip="A fixed amount you pay for a covered service."
            >
              <i aria-hidden="true" className="fa-solid fa-circle-info text-info cursor-pointer" />
            </div>
          </legend>
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
          <legend className="fieldset-legend flex items-center gap-2">
            Coinsurance
            <div
              className="tooltip tooltip-right"
              data-tip="The percentage of costs you pay after meeting your deductible."
            >
              <i aria-hidden="true" className="fa-solid fa-circle-info text-info cursor-pointer" />
            </div>
          </legend>
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
            <legend className="fieldset-legend flex items-center gap-2">
              Out-of-pocket Max
              <div
                className="tooltip tooltip-right"
                data-tip="The most you have to pay for covered services in a plan year."
              >
                <i
                  aria-hidden="true"
                  className="fa-solid fa-circle-info text-info cursor-pointer"
                />
              </div>
            </legend>
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
            <legend className="fieldset-legend flex items-center gap-2">
              OOP Used
              <div
                className="tooltip tooltip-right"
                data-tip="How much of your out-of-pocket max you've already paid this year."
              >
                <i
                  aria-hidden="true"
                  className="fa-solid fa-circle-info text-info cursor-pointer"
                />
              </div>
            </legend>
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
