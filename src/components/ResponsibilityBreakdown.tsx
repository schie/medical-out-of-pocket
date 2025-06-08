import { useMemo, type FC } from 'react';
import { useSelector } from 'react-redux';
import {
  sumSelectedProceduresCost,
  totalPatientResponsibilityBreakdown,
  totalInsuranceResponsibilityBreakdown,
} from '../store';

// Import your RootState type from your store file
import type { RootState } from '../store';

function useCash<T>(value: T) {
  return useMemo(() => {
    if (typeof value === 'number') {
      return `$ ${value.toFixed(2)}`;
    } else if (value == null || value === undefined) {
      return '$ 0.00';
    }
    return value;
  }, [value]);
}

function useSkrillaSelector<T>(selector: (state: RootState) => T) {
  const output = useSelector(selector);

  return useCash(output);
}

interface ResponsibilityBreakdownProps {
  isVertical?: boolean;
}

export const ResponsibilityBreakdown: FC<ResponsibilityBreakdownProps> = ({ isVertical }) => {
  const totalCost = useSkrillaSelector(sumSelectedProceduresCost);
  const finalResponsbility = useSelector(totalPatientResponsibilityBreakdown);
  const insResponsiblity = useSelector(totalInsuranceResponsibilityBreakdown);

  const statsClass = useMemo(
    () => `stats shadow stats-vertical ${isVertical ? '' : 'lg:stats-horizontal'}`,
    [isVertical]
  );

  return (
    <div className="p-4 flex flex-col justify-center">
      <div className={statsClass}>
        <div className="stat">
          <div className="stat-figure text-primary">
            <i
              aria-hidden="true"
              className="fa-solid fa-notes-medical inline-block h-8 w-8 stroke-current"
            />
          </div>
          <div className="stat-title">Cost of Procedures</div>
          <div className="stat-value text-primary">{totalCost}</div>
          <div className="stat-desc">total cost of all selected procedures.</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <i
              aria-hidden="true"
              className="fa-solid fa-shield-halved inline-block h-8 w-8 stroke-current"
            />
          </div>
          <div className="stat-title">Insurance</div>
          <div className="stat-value text-secondary">{useCash(insResponsiblity.total)}</div>
          <div className="stat-desc overflow-clip">{insResponsiblity.percentage.toFixed(2)} %</div>
        </div>

        <div className="stat">
          <div className="stat-figure">
            <i
              aria-hidden="true"
              className="fa-solid fa-user-injured inline-block h-8 w-8 stroke-current"
            />
          </div>
          <div className="stat-title">Patient</div>
          <div className="stat-value">{useCash(finalResponsbility.total)}</div>
          <div className="stat-desc overflow-clip">
            {finalResponsbility.percentage.toFixed(2)} %
          </div>
        </div>
      </div>
    </div>
  );
};
