import React, { useRef, useState, useEffect } from 'react';
import { updatePageMeta } from '../../lib/seo';
import QRCode from 'qrcode';

const QRGenerator: React.FC = () => {
  const [value, setValue] = useState('');
  const [type, setType] = useState<'text'|'url'|'email'|'phone'>('text');
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const generate = async () => {
    try {
      const payload = value;
      const url = await QRCode.toDataURL(payload, { margin: 2, width: 300 });
      setDataUrl(url);
    } catch (e) {
      console.error(e);
      setDataUrl(null);
    }
  };

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${type || 'qr'}.png`;
    a.click();
  };

  const clear = () => {
    setValue('');
    setDataUrl(null);
  };

  useEffect(()=>{
    updatePageMeta({ title: 'QR Code Generator', description: 'Generate QR codes from text, URLs, emails, or phones.' });
  },[]);

  return (
    <div className="min-h-screen bg-[#000000] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">QR Code Generator</h1>
        <p className="text-sm text-[#A1A1AA] mb-6">Generate QR codes from text, URL, email or phone.</p>

        <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6 shadow-sm">
          <label className="block text-sm mb-2">Type</label>
          <div className="flex gap-2 mb-4">
            {(['text','url','email','phone'] as const).map((t) => (
              <button key={t} onClick={() => setType(t)} className={`px-3 py-1 rounded ${type===t? 'bg-white text-black' : 'bg-transparent border'}`}>
                {t}
              </button>
            ))}
          </div>

          <label className="block text-sm mb-2">Input</label>
          <input value={value} onChange={(e)=>setValue(e.target.value)} className="w-full p-3 rounded bg-[#000] border border-[#333] mb-4" placeholder="Enter text or URL" />

          <div className="flex gap-2">
            <button onClick={generate} className="px-4 py-2 bg-white text-black rounded">Generate</button>
            <button onClick={clear} className="px-4 py-2 border rounded">Clear</button>
            <button onClick={download} disabled={!dataUrl} className="px-4 py-2 ml-auto bg-[#111] border rounded">Download PNG</button>
          </div>

          <div className="mt-6 text-center">
            {dataUrl ? (
              <img src={dataUrl} alt="QR preview" className="mx-auto" />
            ) : (
              <div className="text-sm text-[#A1A1AA]">No QR code yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;

