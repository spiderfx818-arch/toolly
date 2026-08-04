import React, { useMemo, useState, useEffect } from 'react';
import { updatePageMeta } from '../../lib/seo';

const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lower = 'abcdefghijklmnopqrstuvwxyz';
const nums = '0123456789';
const syms = '!@#$%^&*()_+[]{}|;:,.<>?~';

const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState(16);
  const [hasUpper, setHasUpper] = useState(true);
  const [hasLower, setHasLower] = useState(true);
  const [hasNumbers, setHasNumbers] = useState(true);
  const [hasSymbols, setHasSymbols] = useState(false);
  const [password, setPassword] = useState('');

  const charset = useMemo(() => {
    let s = '';
    if (hasUpper) s += upper;
    if (hasLower) s += lower;
    if (hasNumbers) s += nums;
    if (hasSymbols) s += syms;
    return s;
  }, [hasUpper, hasLower, hasNumbers, hasSymbols]);

  const generate = () => {
    if (!charset) return setPassword('');
    let res = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      res += charset[array[i] % charset.length];
    }
    setPassword(res);
  };

  const copy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
  };

  const strength = () => {
    let score = 0;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumbers) score++;
    if (hasSymbols) score++;
    if (length >= 12) score++;
    return score;
  };

  useEffect(()=>{
    updatePageMeta({ title: 'Password Generator', description: 'Generate secure passwords instantly in your browser.' });
  },[]);

  return (
    <div className="min-h-screen bg-[#000] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Password Generator</h1>
        <p className="text-sm text-[#A1A1AA] mb-6">Generate strong passwords locally in your browser.</p>

        <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6 shadow-sm">
          <div className="mb-4">
            <label className="block text-sm mb-2">Length: {length}</label>
            <input type="range" min={6} max={64} value={length} onChange={(e)=>setLength(Number(e.target.value))} className="w-full" />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <label className="flex items-center gap-2"><input type="checkbox" checked={hasUpper} onChange={(e)=>setHasUpper(e.target.checked)} /> Uppercase</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={hasLower} onChange={(e)=>setHasLower(e.target.checked)} /> Lowercase</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={hasNumbers} onChange={(e)=>setHasNumbers(e.target.checked)} /> Numbers</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={hasSymbols} onChange={(e)=>setHasSymbols(e.target.checked)} /> Symbols</label>
          </div>

          <div className="flex gap-2 items-center mb-4">
            <button onClick={generate} className="px-4 py-2 bg-white text-black rounded">Generate</button>
            <button onClick={copy} className="px-4 py-2 border rounded">Copy</button>
            <button onClick={()=>setPassword('')} className="px-4 py-2 border rounded">Clear</button>
            <div className="ml-auto">Strength: <strong>{strength()}/5</strong></div>
          </div>

          <div className="bg-[#000] p-3 rounded text-lg font-mono break-all">{password || 'Your password will appear here.'}</div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;

