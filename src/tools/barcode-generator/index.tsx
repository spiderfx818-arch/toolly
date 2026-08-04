import React, { useRef, useState, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { updatePageMeta } from '../../lib/seo';

const BarcodeGenerator: React.FC = () => {
  const [value, setValue] = useState('123456789012');
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    try {
      JsBarcode(svgRef.current, value, { format: 'ean13', displayValue: true, width: 2 });
    } catch (e) {
      // fallback to CODE128
      try { JsBarcode(svgRef.current, value, { format: 'CODE128', displayValue: true }); } catch {}
    }
  }, [value]);

  const download = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'barcode.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => setValue('');

  useEffect(()=>{
    updatePageMeta({ title: 'Barcode Generator', description: 'Generate barcodes from numbers or text.' });
  },[]);

  return (
    <div className="min-h-screen bg-[#000000] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Barcode Generator</h1>
        <p className="text-sm text-[#A1A1AA] mb-6">Generate common barcode formats from numbers or text.</p>

        <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-6 shadow-sm">
          <label className="block text-sm mb-2">Input</label>
          <input value={value} onChange={(e)=>setValue(e.target.value)} className="w-full p-3 rounded bg-[#000] border border-[#333] mb-4" placeholder="Enter numbers or text" />

          <div className="flex gap-2">
            <button onClick={download} className="px-4 py-2 bg-white text-black rounded">Download SVG</button>
            <button onClick={clear} className="px-4 py-2 border rounded">Clear</button>
          </div>

          <div className="mt-6 text-center">
            <svg ref={svgRef}></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeGenerator;

