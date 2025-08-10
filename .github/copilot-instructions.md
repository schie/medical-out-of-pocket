# Medical Out-of-Pocket Calculator

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

The Medical Out-of-Pocket Calculator (MOOP) is a React + TypeScript + Vite web application that calculates insurance cost sharing for medical procedures. It supports primary and secondary insurance configurations with deductibles, coinsurance, copays, and out-of-pocket maximums.

## Working Effectively

### Initial Setup and Dependencies
- Bootstrap the application:
  - `npm ci` -- installs dependencies in 90 seconds. NEVER CANCEL. Set timeout to 150+ seconds.
- Build the application:
  - `npm run build` -- compiles TypeScript and builds with Vite in 8 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- Run tests:
  - `npm test` -- runs Jest test suite in 7 seconds with 77 tests. NEVER CANCEL. Set timeout to 30+ seconds.
- Run linting:
  - `npm run lint` -- runs ESLint in 1.5 seconds. NEVER CANCEL. Set timeout to 30+ seconds.

### Development and Preview
- Development server:
  - `npm run dev` -- starts Vite dev server on http://localhost:5173/medical-out-of-pocket/ in 1 second
- Production preview:
  - `npm run preview` -- starts preview server on http://localhost:4173/medical-out-of-pocket/ (requires running `npm run build` first)

## Validation

### Manual Testing Requirements
ALWAYS manually validate any new code by testing these complete user scenarios after making changes:

1. **Add Procedure Workflow**: 
   - Search for a procedure (e.g., type "Physical therapy")
   - Select a procedure from the dropdown
   - Enter a cost (e.g., $150)
   - Click Add button
   - Verify procedure appears in the list
   - Verify cost calculations update in the responsibility breakdown

2. **Insurance Configuration Workflow**:
   - Set primary insurance values (deductible, coinsurance, copay, out-of-pocket max)
   - Add secondary insurance by clicking the "+" button
   - Configure secondary insurance values
   - Verify calculations update correctly for dual insurance scenarios

3. **Calculation Validation**:
   - Verify that responsibility breakdown shows correct percentages and amounts
   - Test edge cases like costs exceeding deductibles and out-of-pocket maximums
   - Ensure sliders and input fields stay synchronized

### Continuous Integration Validation
- Always run `npm run lint` before committing or the CI (.github/workflows/test.yml) will fail
- The application MUST build successfully with `npm run build`
- All tests MUST pass with `npm test`

## Common Tasks

### Repository Structure
```
/home/runner/work/medical-out-of-pocket/medical-out-of-pocket/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── components/             # React components
│   │   ├── AddProcedure.tsx   # Procedure search and add form
│   │   ├── InsuranceCard.tsx  # Insurance configuration form
│   │   ├── ProceduresCard.tsx # Procedures list display
│   │   ├── ResponsibilityBreakdown.tsx # Cost calculation display
│   │   └── _cpt.json          # CPT procedure codes database
│   ├── store/                 # Redux store configuration
│   │   ├── index.ts           # Store setup
│   │   ├── insuranceSlice.ts  # Insurance state management
│   │   └── proceduresSlice.ts # Procedures state management
│   └── hooks/                 # Custom React hooks
├── __tests__/                 # Jest test files
│   ├── hooks/
│   └── store/
├── .github/workflows/         # CI/CD workflows
└── package.json              # Dependencies and scripts
```

### Key Technology Notes
- **Framework**: React 19 + TypeScript 5.8 + Vite 6
- **State Management**: Redux Toolkit with Redux Persist for data persistence
- **Styling**: Tailwind CSS 4 + DaisyUI 5 components
- **Testing**: Jest 30 with jsdom environment for React component testing
- **Build System**: Vite with SWC for fast compilation
- **Node.js**: Requires Node.js 22 (specified in .nvmrc)

### Important Code Patterns

#### Insurance Type Definition
The Insurance interface in `src/store/insuranceSlice.ts` requires all fields:
```typescript
interface Insurance {
  deductible: number;
  deductibleUsed: number;
  oopMax: number;
  coInsurance: number;
  copay: number;
  oopUsed?: number;
}
```

#### State Structure
- Insurance state supports primary (required) and secondary (optional) insurance
- Procedures state maintains a list of selected procedures with costs
- All state is persisted to localStorage via redux-persist

#### Component Hierarchy
- `App.tsx` orchestrates the main layout and insurance management
- `ProceduresCard.tsx` contains the procedures list and add form
- `InsuranceCard.tsx` is reusable for both primary and secondary insurance
- `ResponsibilityBreakdown.tsx` calculates and displays cost sharing

### Build Artifacts
- Build output goes to `dist/` directory
- Static assets are served from `/medical-out-of-pocket/` base path (configured for GitHub Pages)
- CSS is extracted and includes DaisyUI component styles (~31KB gzipped)
- JavaScript bundle is ~342KB gzipped

### Common Issues
- **Missing deductibleUsed field**: When creating Insurance objects, ensure all required fields are included
- **TypeScript compilation errors**: Run `npm run build` to catch type errors early
- **Test environment**: Jest uses jsdom environment for DOM testing; some browser APIs may not be available
- **Base path**: Application is configured for deployment under `/medical-out-of-pocket/` subdirectory

### Performance Notes
- Build process uses SWC for fast TypeScript compilation
- Bundle size warning appears for chunks >500KB (normal for this application)
- Hot reload works in development mode for rapid iteration
- Tests run in parallel for fast feedback

Always build and exercise your changes by running through the complete user scenarios above before considering your work complete.