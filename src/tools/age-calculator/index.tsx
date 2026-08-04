import React, { useState, useEffect } from 'react';
import { updatePageMeta } from '../../lib/seo';

const AgeCalculator: React.FC = () => {
  const [dob, setDob] = useState('');
  const [result, setResult] = useState<null | { years:number; months:number; days:number; nextBirthday: string }>(null);

  const calculate = () => {
    if (!dob) return;
    const birth = new Date(dob);
    const now = new Date();
    if (isNaN(birth.getTime())) return;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const nextBD = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBD < now) nextBD.setFullYear(nextBD.getFullYear()+1);

    setResult({ years, months, days, nextBirthday: nextBD.toDateString() });
  };

  const reset = () => { setDob(''); setResult(null); };

  useEffect(()=>{
    updatePageMeta({ title: 'Age Calculator', description: 'Calculate age in years, months and days from date of birth.' });
  },[]);

  return (
    <div className="min-h-screen bg-[#000] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Age Calculator</h1>
        <p className="text-sm text-[#A1A1AA] mb-6">Calculate your age in years, months and days.</p>

        <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6 shadow-sm">
          <label className="block text-sm mb-2">Date of Birth</label>
          <input type="date" value={dob} onChange={(e)=>setDob(e.target.value)} className="w-full p-3 rounded bg-[#000] border border-[#333] mb-4" />

          <div className="flex gap-2">
            <button onClick={calculate} className="px-4 py-2 bg-white text-black rounded">Calculate</button>
            <button onClick={reset} className="px-4 py-2 border rounded">Reset</button>
          </div>

          {result && (
            <div className="mt-6 bg-[#000] p-4 rounded">
              <div className="text-lg font-semibold">{result.years} years, {result.months} months, {result.days} days</div>
              <div className="text-sm text-[#A1A1AA] mt-2">Next birthday: {result.nextBirthday}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgeCalculator;

