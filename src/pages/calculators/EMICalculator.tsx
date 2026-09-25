import React, { useState } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';

export const EMICalculator: React.FC = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [result, setResult] = useState<{ emi: string, totalInterest: string, totalPayment: string } | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(tenure);

    if (!isNaN(p) && !isNaN(r) && !isNaN(n) && p > 0 && n > 0) {
      const emi = p * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
      const totalPayment = emi * n;
      const totalInterest = totalPayment - p;

      setResult({
        emi: emi.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        totalPayment: totalPayment.toFixed(2)
      });
    }
  };

  const reset = () => {
    setPrincipal('');
    setRate('');
    setTenure('');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold flex items-center gap-3">
          <Calculator className="text-primary" size={32} />
          EMI Calculator
        </h1>
        <p className="text-text-secondary mt-2">Calculate your Equated Monthly Installments for loans.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card space-y-6">
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">Loan Amount (Principal)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full bg-bg-input border border-border-dark rounded-lg px-4 py-3 text-text-primary outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">Interest Rate (% per annum)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full bg-bg-input border border-border-dark rounded-lg px-4 py-3 text-text-primary outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">Loan Tenure (in months)</label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full bg-bg-input border border-border-dark rounded-lg px-4 py-3 text-text-primary outline-none focus:border-primary"
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-border-dark">
            <button onClick={calculate} className="btn-primary w-full">Calculate</button>
            <button onClick={reset} className="btn-secondary w-auto p-3" title="Reset">
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {result && (
          <div className="card bg-bg-input/50 flex flex-col justify-center gap-6">
            <div className="text-center">
              <p className="text-text-secondary text-sm font-medium mb-1">Monthly EMI</p>
              <p className="text-4xl font-extrabold text-primary">${result.emi}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-6 border-t border-border-dark text-center">
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Total Interest</p>
                <p className="font-bold text-lg text-text-primary">${result.totalInterest}</p>
              </div>
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Total Payment</p>
                <p className="font-bold text-lg text-text-primary">${result.totalPayment}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
