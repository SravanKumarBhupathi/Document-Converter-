import React, { useState } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';

export const AgeCalculator: React.FC = () => {
  const [dob, setDob] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ years: number, months: number, days: number } | null>(null);

  const calculate = () => {
    if (!dob) return;

    const d1 = new Date(dob);
    const d2 = new Date(targetDate);

    if (d1 > d2) {
      setResult(null);
      return;
    }

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months -= 1;
      // Get days in previous month
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setResult({ years, months, days });
  };

  const reset = () => {
    setDob('');
    setTargetDate(new Date().toISOString().split('T')[0]);
    setResult(null);
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold flex items-center gap-3">
          <Calculator className="text-primary" size={32} />
          Age Calculator
        </h1>
        <p className="text-text-secondary mt-2">Find out exactly how old you are.</p>
      </div>

      <div className="card space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-bg-input border border-border-dark rounded-lg px-4 py-3 text-text-primary outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">Calculate age at date</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-bg-input border border-border-dark rounded-lg px-4 py-3 text-text-primary outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-border-dark">
          <button onClick={calculate} className="btn-primary w-full sm:w-auto">Calculate Age</button>
          <button onClick={reset} className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2">
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        {result && (
          <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl flex flex-col items-center">
            <p className="text-text-secondary font-medium mb-4">Age</p>
            <div className="flex items-end gap-6 text-center">
              <div>
                <p className="text-5xl font-extrabold text-primary">{result.years}</p>
                <p className="text-text-muted uppercase text-xs font-bold mt-1 tracking-wider">Years</p>
              </div>
              <div>
                <p className="text-5xl font-extrabold text-text-primary">{result.months}</p>
                <p className="text-text-muted uppercase text-xs font-bold mt-1 tracking-wider">Months</p>
              </div>
              <div>
                <p className="text-5xl font-extrabold text-text-primary">{result.days}</p>
                <p className="text-text-muted uppercase text-xs font-bold mt-1 tracking-wider">Days</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
