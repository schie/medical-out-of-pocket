import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { persistor, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { setProcedures } from './store/proceduresSlice';
import { setInsuranceState, type InsuranceState } from './store/insuranceSlice';

function loadFromQuery() {
  const params = new URLSearchParams(window.location.search);

  const proceduresParam = params.get('procedures');
  if (proceduresParam) {
    try {
      const list = JSON.parse(proceduresParam);
      if (Array.isArray(list)) {
        store.dispatch(setProcedures(list));
      }
    } catch {
      // ignore parse errors
    }
  }

  const hasPrimary = params.get('primary');
  const hasSecondary = params.get('secondary');
  if (hasPrimary || hasSecondary) {
    const insState: InsuranceState = {
      primary: {
        deductible: 0,
        oopMax: 0,
        coInsurance: 0,
        copay: 0,
        oopUsed: 0,
      },
    };

    if (hasPrimary) {
      try {
        insState.primary = JSON.parse(hasPrimary);
      } catch {
        /* ignore */
      }
    }
    if (hasSecondary) {
      try {
        insState.secondary = JSON.parse(hasSecondary);
      } catch {
        /* ignore */
      }
    }

    store.dispatch(setInsuranceState(insState));
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} onBeforeLift={loadFromQuery}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
