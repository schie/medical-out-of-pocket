import { renderHook } from '@testing-library/react';
import useProcedureValidation from '../../src/hooks/useProcedureValidation';

describe('useProcedureValidation', () => {
  it('returns valid when name and cost are valid', () => {
    const { result } = renderHook(() => useProcedureValidation('Procedure', '100'));
    expect(result.current.parsedCost).toBe(100);
    expect(result.current.isInvalid).toBe(false);
    expect(result.current.errorMessage).toBe('');
  });

  it('returns invalid when name is empty', () => {
    const { result } = renderHook(() => useProcedureValidation('', '100'));
    expect(result.current.isInvalid).toBe(true);
    expect(result.current.errorMessage).toBe('Name is required');
  });

  it('returns invalid when name is whitespace', () => {
    const { result } = renderHook(() => useProcedureValidation('   ', '100'));
    expect(result.current.isInvalid).toBe(true);
    expect(result.current.errorMessage).toBe('Name is required');
  });

  it('returns parsedCost as NaN when cost is not a number', () => {
    const { result } = renderHook(() => useProcedureValidation('Procedure', 'abc'));
    expect(result.current.parsedCost).toBeNaN();
  });

  it('returns parsedCost as 0 when cost is "0"', () => {
    const { result } = renderHook(() => useProcedureValidation('Procedure', '0'));
    expect(result.current.parsedCost).toBe(0);
    expect(result.current.isInvalid).toBe(false);
    expect(result.current.errorMessage).toBe('');
  });

  it('trims name and cost before validation', () => {
    const { result } = renderHook(() => useProcedureValidation('  Procedure  ', ' 200 '));
    expect(result.current.parsedCost).toBe(200);
    expect(result.current.isInvalid).toBe(false);
    expect(result.current.errorMessage).toBe('');
  });

  it('returns invalid when cost is negative', () => {
    const { result } = renderHook(() => useProcedureValidation('Procedure', '-10'));
    expect(result.current.parsedCost).toBe(-10);
    expect(result.current.isInvalid).toBe(true);
    expect(result.current.errorMessage).toBe('Cost cannot be negative');
  });
});
