import React, { useRef, useState, useEffect } from 'react';
import { updatePageMeta } from '../../lib/seo';

const ImageCompressor: React.FC = ()=>{
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onFile = (f:File | null)=>{
    if(!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    compressFile(f, quality);
  };

  const compressFile = (f:File, q:number)=>{
    const img = new Image();
    const url = URL.createObjectURL(f);
    img.onload = ()=>{
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if(!ctx) return;
      ctx.drawImage(img,0,0);
      canvas.toBlob((blob)=>{
        if(!blob) return;
        const compUrl = URL.createObjectURL(blob);
        setCompressedPreview(compUrl);
      }, 'image/jpeg', q);
    };
    img.src = url;
  };

  const onDrop = (e:React.DragEvent)=>{ e.preventDefault(); if(e.dataTransfer.files?.[0]) onFile(e.dataTransfer.files[0]); };

  const download = ()=>{
    if(!compressedPreview) return;
    const a = document.createElement('a');
    a.href = compressedPreview; a.download = 'compressed.jpg'; a.click();
  };

  const reset = ()=>{ setFile(null); setPreview(null); setCompressedPreview(null); }

  useEffect(()=>{ updatePageMeta({ title: 'Image Compressor', description: 'Compress images locally in the browser without uploading.' }); },[]);

  return (
    <div className="min-h-screen bg-[#000] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Image Compressor</h1>
        <p className="text-sm text-[#A1A1AA] mb-6">Compress images locally without uploading to a server.</p>

        <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6 shadow-sm" onDrop={onDrop} onDragOver={(e)=>e.preventDefault()}>
          <input ref={inputRef} type="file" accept="image/*" onChange={(e)=>onFile(e.target.files?.[0]||null)} className="mb-4" />
          <label className="block mb-2">Quality: {Math.round(quality*100)}%</label>
          <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e)=>{ setQuality(Number(e.target.value)); if(file) compressFile(file, Number(e.target.value)); }} className="w-full mb-4" />

          <div className="flex gap-4">
            <div className="w-1/2">
              <div className="text-sm mb-2">Original</div>
              {preview ? <img src={preview} alt="original" className="max-h-40 object-contain" /> : <div className="text-sm text-[#A1A1AA]">No image</div>}
            </div>
            <div className="w-1/2">
              <div className="text-sm mb-2">Compressed</div>
              {compressedPreview ? <img src={compressedPreview} alt="compressed" className="max-h-40 object-contain" /> : <div className="text-sm text-[#A1A1AA]">No compressed image</div>}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={download} className="px-4 py-2 bg-white text-black rounded" disabled={!compressedPreview}>Download</button>
            <button onClick={reset} className="px-4 py-2 border rounded">Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCompressor;
