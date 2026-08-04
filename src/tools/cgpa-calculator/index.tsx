import React, { useState, useEffect } from 'react';
import { updatePageMeta } from '../../lib/seo';

type Subject = { id: number; name: string; credits:number; grade:string };

const GRADE_POINT: Record<string, number> = { A:4, B:3, C:2, D:1, F:0 };

const CGPACalculator: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([{ id:Date.now(), name:'Course 1', credits:3, grade:'A' }]);

  const add = () => setSubjects(s => [...s, { id: Date.now()+Math.random(), name:'', credits:3, grade:'A' }]);
  const remove = (id:number) => setSubjects(s=>s.filter(x=>x.id!==id));
  const update = (id:number, data:Partial<Subject>) => setSubjects(s=>s.map(x=>x.id===id? {...x,...data}:x));
  const reset = () => setSubjects([{ id:Date.now(), name:'Course 1', credits:3, grade:'A' }]);

  const calc = () => {
    let totalCredits = 0; let totalPoints = 0;
    for (const sub of subjects) {
      const gp = GRADE_POINT[sub.grade.toUpperCase()] ?? 0;
      totalCredits += Number(sub.credits) || 0;
      totalPoints += gp * (Number(sub.credits) || 0);
    }
    const cgpa = totalCredits ? (totalPoints/totalCredits) : 0;
    return { totalCredits, cgpa: Number(cgpa.toFixed(2)) };
  };

  const { totalCredits, cgpa } = calc();

  useEffect(()=>{ updatePageMeta({ title: 'CGPA Calculator', description: 'Calculate CGPA from subjects, credits and grades.' }); },[]);

  return (
    <div className="min-h-screen bg-[#000] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">CGPA Calculator</h1>
        <p className="text-sm text-[#A1A1AA] mb-6">Add subjects with credits and grades to calculate CGPA.</p>

        <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6 shadow-sm">
          {subjects.map((s, idx)=> (
            <div key={s.id} className="grid grid-cols-6 gap-2 items-center mb-2">
              <input className="col-span-2 p-2 bg-[#000] border rounded" placeholder="Subject" value={s.name} onChange={(e)=>update(s.id,{name:e.target.value})} />
              <input className="col-span-1 p-2 bg-[#000] border rounded" type="number" min={0} value={s.credits} onChange={(e)=>update(s.id,{credits:Number(e.target.value)})} />
              <select className="col-span-1 p-2 bg-[#000] border rounded" value={s.grade} onChange={(e)=>update(s.id,{grade:e.target.value})}>
                {['A','B','C','D','F'].map(g=><option key={g} value={g}>{g}</option>)}
              </select>
              <div className="col-span-2 flex gap-2 justify-end">
                <button onClick={()=>remove(s.id)} className="px-3 py-1 border rounded">Remove</button>
              </div>
            </div>
          ))}

          <div className="flex gap-2 mt-4">
            <button onClick={add} className="px-4 py-2 bg-white text-black rounded">Add Subject</button>
            <button onClick={reset} className="px-4 py-2 border rounded">Reset</button>
            <div className="ml-auto">Total Credits: <strong>{totalCredits}</strong></div>
          </div>

          <div className="mt-4 bg-[#000] p-3 rounded">CGPA: <strong>{cgpa}</strong></div>
        </div>
      </div>
    </div>
  );
};

export default CGPACalculator;
