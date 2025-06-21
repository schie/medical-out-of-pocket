import { useCallback, type ReactNode } from 'react';
import type { Insurance } from '../store';

import Field from './Field';

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

  const selectOnFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }, []);

  return (
    <div className="card bg-base-200 shadow-xl p-4 relative dark:shadow-white/20">
      {cornerButton && <div className="absolute right-2 top-2">{cornerButton}</div>}
      <h2 className="card-title mb-4">
        <i aria-hidden="true" className="fa-solid fa-shield-halved mr-2" />
        {label}
      </h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <Field
            label="Deductible"
            tooltip="The amount you pay for covered health care services before your insurance plan starts to pay."
            prefix="$"
            value={insurance.deductible}
            onChange={handleChange('deductible')}
            onFocus={selectOnFocus}
            min={0}
          />
          <Field
            className="flex-1"
            label="Deductible Used"
            tooltip="How much of your deductible you've already paid this year."
            prefix="$"
            value={insurance.deductibleUsed}
            onChange={handleChange('deductibleUsed')}
            onFocus={selectOnFocus}
            min={0}
            max={insurance.deductible}
          />
        </div>
        <input
          type="range"
          min={0}
          max={insurance.deductible}
          value={insurance.deductibleUsed}
          className="range w-full"
          onChange={handleChange('deductibleUsed')}
        />
        <Field
          label="Copay"
          tooltip="A fixed amount you pay for a covered service."
          prefix="$"
          value={insurance.copay}
          onChange={handleChange('copay')}
          onFocus={selectOnFocus}
          min={0}
        />
        <Field
          label="Coinsurance"
          tooltip="The percentage of costs you pay after meeting your deductible."
          prefix="%"
          value={insurance.coInsurance}
          onChange={handleChange('coInsurance')}
          onFocus={selectOnFocus}
          step="0.01"
          min={0}
          max={100}
        />
        <div className="flex flex-row gap-4">
          <Field
            className="flex-1"
            label="Out-of-pocket Max"
            tooltip="The most you have to pay for covered services in a plan year."
            prefix="$"
            value={insurance.oopMax}
            onChange={handleChange('oopMax')}
            onFocus={selectOnFocus}
            min={0}
          />
          <Field
            className="flex-1"
            label="OOP Used"
            tooltip="How much of your out-of-pocket max you've already paid this year."
            prefix="$"
            value={insurance.oopUsed}
            onChange={handleChange('oopUsed')}
            onFocus={selectOnFocus}
            min={0}
            max={insurance.oopMax}
          />
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
