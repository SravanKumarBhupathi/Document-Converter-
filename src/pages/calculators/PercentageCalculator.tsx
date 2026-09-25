import React, { useState } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';

export const PercentageCalculator: React.FC = () => {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const v1 = parseFloat(val1);
    const v2 = parseFloat(val2);
    if (!isNaN(v1) && !isNaN(v2)) {
      setResult(((v1 / 100) * v2).toString());
    } else {
      setResult('Invalid Input');
    }
  };

  const reset = () => {
    setVal1('');
    setVal2('');
    setResult(null);
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold flex items-center gap-3">
          <Calculator className="text-primary" size={32} />
          Percentage Calculator
        </h1>
        <p className="text-text-secondary mt-2">What is X% of Y?</p>
      </div>

      <div className="card space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full">
            <label className="block text-sm font-semibold text-text-secondary mb-2">Percentage (X)</label>
            <div className="relative">
              <input
                type="number"
                value={val1}
                onChange={(e) => setVal1(e.target.value)}
                placeholder="20"
                className="w-full bg-bg-input border border-border-dark rounded-lg pl-4 pr-8 py-3 text-white outline-none focus:border-primary"
              />
              <span className="absolute right-3 top-3 text-text-muted font-bold">%</span>
            </div>
          </div>

          <span className="text-text-muted font-bold text-lg mt-6">of</span>

          <div className="w-full">
            <label className="block text-sm font-semibold text-text-secondary mb-2">Value (Y)</label>
            <input
              type="number"
              value={val2}
              onChange={(e) => setVal2(e.target.value)}
              placeholder="150"
              className="w-full bg-bg-input border border-border-dark rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-border-dark">
          <button onClick={calculate} className="btn-primary w-full sm:w-auto">Calculate</button>
          <button onClick={reset} className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2">
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        {result && (
          <div className="mt-8 p-6 bg-primary/10 border border-primary/20 rounded-xl text-center">
            <p className="text-text-secondary font-medium mb-1">Result</p>
            <p className="text-4xl font-extrabold text-primary">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};
