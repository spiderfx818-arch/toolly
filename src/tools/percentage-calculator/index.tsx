import React, { useState, useEffect } from 'react';
import { updatePageMeta } from '../../lib/seo';

const PercentageCalculator: React.FC = () => {
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [result, setResult] = useState<string>('');

  const calcXOfY = () => { const xv = parseFloat(x); const yv = parseFloat(y); if (isNaN(xv)||isNaN(yv)) { setResult('Invalid input'); return;} setResult(`${(xv/100)*yv}`); };
  const calcXisOfY = () => { const xv = parseFloat(x); const yv = parseFloat(y); if (isNaN(xv)||isNaN(yv)) { setResult('Invalid input'); return;} setResult(`${(xv/yv)*100}%`); };
  const increase = () => { const xv = parseFloat(x); const yv = parseFloat(y); if (isNaN(xv)||isNaN(yv)) { setResult('Invalid input'); return;} setResult(`${((yv - xv)/xv)*100}%`); };
  const decrease = () => { const xv = parseFloat(x); const yv = parseFloat(y); if (isNaN(xv)||isNaN(yv)) { setResult('Invalid input'); return;} setResult(`${((xv - yv)/xv)*100}%`); };
  const originalFromPercent = () => { const xv = parseFloat(x); const yv = parseFloat(y); if (isNaN(xv)||isNaN(yv)) { setResult('Invalid input'); return;} setResult(`${(yv*100)/xv}`); };

  const reset = () => { setX(''); setY(''); setResult(''); };

  useEffect(()=>{ updatePageMeta({ title: 'Percentage Calculator', description: 'Calculate percentages: X% of Y, percentage increase/decrease and more.' }); },[]);

  return (
    <div className="min-h-screen bg-[#000] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Percentage Calculator</h1>
        <p className="text-sm text-[#A1A1AA] mb-6">Beginner friendly percentage calculations.</p>

        <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6 shadow-sm">
          <label className="block text-sm mb-2">X</label>
          <input value={x} onChange={(e)=>setX(e.target.value)} className="w-full p-3 rounded bg-[#000] border border-[#333] mb-3" />
          <label className="block text-sm mb-2">Y</label>
          <input value={y} onChange={(e)=>setY(e.target.value)} className="w-full p-3 rounded bg-[#000] border border-[#333] mb-3" />

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button onClick={calcXOfY} className="px-3 py-2 bg-white text-black rounded">X% of Y</button>
            <button onClick={calcXisOfY} className="px-3 py-2 border rounded">X is what % of Y</button>
            <button onClick={increase} className="px-3 py-2 border rounded">% Increase</button>
            <button onClick={decrease} className="px-3 py-2 border rounded">% Decrease</button>
            <button onClick={originalFromPercent} className="px-3 py-2 border rounded">Original from %</button>
            <button onClick={reset} className="px-3 py-2 border rounded">Reset</button>
          </div>

          <div className="mt-4 bg-[#000] p-3 rounded">Result: <strong>{result}</strong></div>
        </div>
      </div>
    </div>
  );
};

export default PercentageCalculator;
