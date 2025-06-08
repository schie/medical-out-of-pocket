import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import ProceduresCard from './components/ProceduresCard';
import InsuranceCard from './components/InsuranceCard';
import type { AppDispatch, RootState, Insurance } from './store';
import {
  setPrimaryInsurance,
  setSecondaryInsurance,
  clearSecondaryInsurance,
} from './store/insuranceSlice';

const emptyInsurance: Insurance = {
  name: '',
  deductible: 0,
  oopMax: 0,
  coInsurance: 0,
  copay: 0,
  usage: {
    deductibleUsed: 0,
    oopUsed: 0,
  },
};

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { primary, secondary } = useSelector((state: RootState) => state.insurance);
  const [showSecondary, setShowSecondary] = useState(Boolean(secondary));

  // Synchronize showSecondary with the Redux state
  useEffect(() => {
    setShowSecondary(Boolean(secondary));
  }, [secondary]);
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
    setShowSecondary(true);
    if (!secondary) {
      dispatch(setSecondaryInsurance(emptyInsurance));
    }
  }, [dispatch, secondary]);

  const removeSecondary = useCallback(() => {
    setShowSecondary(false);
    dispatch(clearSecondaryInsurance());
  }, [dispatch]);

  return (
    <div className="p-4 space-y-4">
      <InsuranceCard label="Primary Insurance" insurance={primary} onChange={handlePrimaryChange} />
      {showSecondary ? (
        <div className="space-y-2">
          <InsuranceCard
            label="Secondary Insurance"
            insurance={secondary || emptyInsurance}
            onChange={handleSecondaryChange}
          />
          <button className="btn" onClick={removeSecondary}>
            Remove Secondary
          </button>
        </div>
      ) : (
        <button className="btn" onClick={addSecondary}>
          Add Secondary Insurance
        </button>
      )}
      <ProceduresCard />
    </div>
  );
}

export default App;
