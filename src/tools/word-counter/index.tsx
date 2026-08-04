import React, { useMemo, useState, useEffect } from 'react';
import { updatePageMeta } from '../../lib/seo';

const WordCounter: React.FC = () => {
  const [text, setText] = useState('');

  const stats = useMemo(()=>{
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g,'').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;
    const paragraphs = text.split(/\n{2,}/).filter(p=>p.trim().length>0).length;
    const readingTime = Math.ceil(words / 200);
    return { chars, charsNoSpaces, words, sentences, paragraphs, readingTime };
  },[text]);

  const clear = () => setText('');
  const copy = async () => { await navigator.clipboard.writeText(text); };

  useEffect(()=>{ updatePageMeta({ title: 'Word Counter', description: 'Count words, characters, sentences and reading time in real time.' }); },[]);

  return (
    <div className="min-h-screen bg-[#000] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Word Counter</h1>
        <p className="text-sm text-[#A1A1AA] mb-6">Count words, characters, sentences and more in real time.</p>

        <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6 shadow-sm">
          <textarea value={text} onChange={(e)=>setText(e.target.value)} className="w-full min-h-[160px] p-3 bg-[#000] border rounded mb-4" placeholder="Paste your text here"></textarea>
          <div className="flex gap-2 mb-4">
            <button onClick={copy} className="px-4 py-2 bg-white text-black rounded">Copy</button>
            <button onClick={clear} className="px-4 py-2 border rounded">Clear</button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>Words: <strong>{stats.words}</strong></div>
            <div>Characters: <strong>{stats.chars}</strong></div>
            <div>Chars (no spaces): <strong>{stats.charsNoSpaces}</strong></div>
            <div>Sentences: <strong>{stats.sentences}</strong></div>
            <div>Paragraphs: <strong>{stats.paragraphs}</strong></div>
            <div>Reading time: <strong>{stats.readingTime} min</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCounter;
