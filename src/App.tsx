import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import ProceduresCard from './components/ProceduresCard';
import InsuranceCard from './components/InsuranceCard';
import { type AppDispatch, type RootState, type Insurance } from './store';
import {
  setPrimaryInsurance,
  setSecondaryInsurance,
  clearSecondaryInsurance,
} from './store/insuranceSlice';
import { ResponsibilityBreakdown } from './components/ResponsibilityBreakdown';

const emptyInsurance: Insurance = {
  name: '',
  deductible: 0,
  oopMax: 0,
  coInsurance: 0,
  copay: 0,
  oopUsed: 0,
};

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { primary, secondary } = useSelector((state: RootState) => state.insurance);
  const handlePrimaryChange = useCallback(
    (ins: Insurance) => {
      dispatch(setPrimaryInsurance(ins));
    },
    [dispatch]
  );

  const handleSecondaryChange = useCallback(
    (ins: Insurance) => {
      dispatch(setSecondaryInsurance(ins));
    },
    [dispatch]
  );

  const addSecondary = useCallback(() => {
    if (!secondary) {
      dispatch(setSecondaryInsurance(emptyInsurance));
    }
  }, [dispatch, secondary]);

  const removeSecondary = useCallback(() => {
    dispatch(clearSecondaryInsurance());
  }, [dispatch]);

  return (
    <div className="flex flex-col w-full gap-4 p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex flex-col">
          <ProceduresCard />
        </div>
        <div className="flex-1 flex flex-col">
          <InsuranceCard
            label="Primary Insurance"
            insurance={primary}
            onChange={handlePrimaryChange}
            cornerButton={
              !secondary && (
                <button
                  className="btn btn-circle btn-xs btn-primary"
                  onClick={addSecondary}
                  aria-label="Add Secondary Insurance"
                >
                  <i className="fa-solid fa-plus" aria-hidden="true" />
                </button>
              )
            }
          />
        </div>
        <div className="flex-1">
          {secondary ? (
            <InsuranceCard
              label="Secondary Insurance"
              insurance={secondary}
              onChange={handleSecondaryChange}
              cornerButton={
                <button
                  className="btn btn-circle btn-xs btn-error"
                  onClick={removeSecondary}
                  aria-label="Remove Secondary Insurance"
                >
                  <i className="fa-solid fa-trash" aria-hidden="true" />
                </button>
              }
            />
          ) : (
            <ResponsibilityBreakdown isVertical />
          )}
        </div>
      </div>
      {secondary && <ResponsibilityBreakdown />}
    </div>
  );
}

export default App;
