import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';

// Hubs
import { ToolsHub } from './pages/ToolsHub';
import { CalculatorsHub } from './pages/CalculatorsHub';
import { GuidesHub } from './pages/GuidesHub';
import { BlogHub } from './pages/BlogHub';

// Tools
import { SplitPDF } from './pages/SplitPDF';
import { MergePDF } from './pages/MergePDF';

// Calculators
import { PercentageCalculator } from './pages/calculators/PercentageCalculator';
import { EMICalculator } from './pages/calculators/EMICalculator';
import { AgeCalculator } from './pages/calculators/AgeCalculator';

// Content Articles
import { GuideArticle } from './pages/GuideArticle';
import { BlogArticle } from './pages/BlogArticle';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Main Application Routes */}
        <Route index element={<Home />} />

        {/* Hubs */}
        <Route path="tools" element={<ToolsHub />} />
        <Route path="calculators" element={<CalculatorsHub />} />
        <Route path="guides" element={<GuidesHub />} />
        <Route path="blog" element={<BlogHub />} />

        {/* Guided Advanced Tools */}
        <Route path="tools/split-pdf" element={<SplitPDF />} />
        <Route path="tools/merge-pdf" element={<MergePDF />} />

        {/* Other tool categories route to tools hub for now */}
        <Route path="tools/pdf-tools" element={<ToolsHub />} />
        <Route path="tools/image-tools" element={<ToolsHub />} />
        <Route path="tools/text-tools" element={<ToolsHub />} />
        <Route path="tools/developer-tools" element={<ToolsHub />} />
        <Route path="tools/student-tools" element={<ToolsHub />} />

        {/* generic fallback for tools */}
        <Route path="tools/:id" element={<Navigate to="/" replace />} />

        {/* Calculators */}
        <Route path="calculators/percentage" element={<PercentageCalculator />} />
        <Route path="calculators/emi" element={<EMICalculator />} />
        <Route path="calculators/age" element={<AgeCalculator />} />

        {/* Content Articles */}
        <Route path="guides/:slug" element={<GuideArticle />} />
        <Route path="blog/:category/:slug" element={<BlogArticle />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
