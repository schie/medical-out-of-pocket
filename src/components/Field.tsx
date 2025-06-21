import { type InputHTMLAttributes, type FC } from 'react';

export interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
  tooltip: string;
  prefix: string;
  className?: string;
}

export const Field: FC<FieldProps> = ({
  label,
  tooltip,
  prefix,
  className = '',
  onFocus,
  onChange,
  value,
  ...inputProps
}) => (
  <fieldset className={`fieldset ${className}`.trim()}>
    <legend className="fieldset-legend flex items-center gap-2">
      {label}
      <div className="tooltip tooltip-right" data-tip={tooltip}>
        <i aria-hidden="true" className="fa-solid fa-circle-info text-info cursor-pointer" />
      </div>
    </legend>
    <label className="input input-bordered flex items-center gap-2 w-full validator">
      <span className="opacity-50">{prefix}</span>
      <input
        type="number"
        className="grow"
        onFocus={onFocus}
        value={value}
        onChange={onChange}
        {...inputProps}
      />
    </label>
  </fieldset>
);

export default Field;
