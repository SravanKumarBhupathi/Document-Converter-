
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { SplitPDF } from './pages/SplitPDF';
import { MergePDF } from './pages/MergePDF';
import { PercentageCalculator } from './pages/calculators/PercentageCalculator';
import { EMICalculator } from './pages/calculators/EMICalculator';
import { AgeCalculator } from './pages/calculators/AgeCalculator';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Main Application Routes */}
        <Route index element={<Home />} />

        {/* Guided Advanced Tools */}
        <Route path="tools/split-pdf" element={<SplitPDF />} />
        <Route path="tools/merge-pdf" element={<MergePDF />} />

        {/* We can route other tools back to Home to trigger the generic converter for now */}
        <Route path="tools/:id" element={<Navigate to="/" replace />} />

        <Route path="tools" element={<Navigate to="/" replace />} />

        {/* Calculators */}
        <Route path="calculators/percentage" element={<PercentageCalculator />} />
        <Route path="calculators/emi" element={<EMICalculator />} />
        <Route path="calculators/age" element={<AgeCalculator />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
