import { useMemo } from 'react';

export default function useProcedureValidation(name: string, cost: string) {
  return useMemo(() => {
    const parsedCost = parseFloat(cost);
    const isInvalid = !name.trim() || isNaN(parsedCost) || parsedCost < 0;
    let errorMessage = '';
    if (!name.trim()) {
      errorMessage = 'Name is required';
    } else if (isNaN(parsedCost)) {
      errorMessage = 'Cost is required';
    } else if (parsedCost < 0) {
      errorMessage = 'Cost cannot be negative';
    }
    return { parsedCost, isInvalid, errorMessage };
  }, [name, cost]);
}
