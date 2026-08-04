import React, { useState, useEffect } from 'react';
import { updatePageMeta } from '../../lib/seo';

const JSONFormatter: React.FC = ()=>{
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const format = ()=>{
    try{ const obj = JSON.parse(text); setText(JSON.stringify(obj, null, 2)); setError(null); }catch(e:any){ setError(e.message); }
  };
  const minify = ()=>{
    try{ const obj = JSON.parse(text); setText(JSON.stringify(obj)); setError(null); }catch(e:any){ setError(e.message); }
  };
  const validate = ()=>{
    try{ JSON.parse(text); setError('Valid JSON'); }catch(e:any){ setError(e.message); }
  };
  const copy = async ()=>{ await navigator.clipboard.writeText(text); };
  const clear = ()=>{ setText(''); setError(null); };

  useEffect(()=>{ updatePageMeta({ title: 'JSON Formatter', description: 'Format, minify and validate JSON entirely in your browser.' }); },[]);

  return (
    <div className="min-h-screen bg-[#000] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">JSON Formatter</h1>
        <p className="text-sm text-[#A1A1AA] mb-6">Format, minify and validate JSON locally in your browser.</p>

        <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6 shadow-sm">
          <textarea value={text} onChange={(e)=>setText(e.target.value)} className="w-full min-h-[220px] p-3 bg-[#000] border rounded mb-4" placeholder='Paste JSON here'></textarea>

          <div className="flex gap-2 mb-4">
            <button onClick={format} className="px-3 py-2 bg-white text-black rounded">Format</button>
            <button onClick={minify} className="px-3 py-2 border rounded">Minify</button>
            <button onClick={validate} className="px-3 py-2 border rounded">Validate</button>
            <button onClick={copy} className="px-3 py-2 border rounded">Copy</button>
            <button onClick={clear} className="px-3 py-2 border rounded">Clear</button>
          </div>

          {error && <div className="text-sm mt-2 text-red-400">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default JSONFormatter;
