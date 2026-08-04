import React, { useState, useEffect } from 'react';
import { updatePageMeta } from '../../lib/seo';

const toTitle = (s:string) => s.toLowerCase().split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
const toSentence = (s:string) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c=>c.toUpperCase());

const TextCaseConverter: React.FC = () => {
  const [text, setText] = useState('');

  const apply = (mode:string) => {
    if (!text) return;
    if (mode==='UP') setText(text.toUpperCase());
    if (mode==='low') setText(text.toLowerCase());
    if (mode==='title') setText(toTitle(text));
    if (mode==='sentence') setText(toSentence(text));
    if (mode==='capitalize') setText(text.split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' '));
    if (mode==='trim') setText(text.replace(/\s+/g,' ').trim());
  };

  const copy = async () => { await navigator.clipboard.writeText(text); };
  const clear = () => setText('');

  useEffect(()=>{ updatePageMeta({ title: 'Text Case Converter', description: 'Convert text casing instantly: UPPERCASE, lowercase, Title Case and more.' }); },[]);

  return (
    <div className="min-h-screen bg-[#000] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Text Case Converter</h1>
        <p className="text-sm text-[#A1A1AA] mb-6">Instantly convert text casing and clean spacing.</p>

        <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6 shadow-sm">
          <textarea value={text} onChange={(e)=>setText(e.target.value)} className="w-full min-h-[140px] p-3 bg-[#000] border rounded mb-4" />
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button onClick={()=>apply('UP')} className="px-3 py-2 bg-white text-black rounded">UPPERCASE</button>
            <button onClick={()=>apply('low')} className="px-3 py-2 border rounded">lowercase</button>
            <button onClick={()=>apply('title')} className="px-3 py-2 border rounded">Title Case</button>
            <button onClick={()=>apply('sentence')} className="px-3 py-2 border rounded">Sentence case</button>
            <button onClick={()=>apply('capitalize')} className="px-3 py-2 border rounded">Capitalize Words</button>
            <button onClick={()=>apply('trim')} className="px-3 py-2 border rounded">Remove extra spaces</button>
          </div>
          <div className="flex gap-2">
            <button onClick={copy} className="px-4 py-2 bg-white text-black rounded">Copy</button>
            <button onClick={clear} className="px-4 py-2 border rounded">Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextCaseConverter;
