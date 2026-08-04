import React from 'react';

export type ToolEntry = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon?: string;
  type?: 'internal' | 'external';
  status?: 'published' | 'draft';
};

export const TOOL_REGISTRY: ToolEntry[] = [
  { id: 'qr-generator', name: 'QR Code Generator', slug: 'qr-generator', description: 'Generate QR codes from text, URLs, emails, or phones.', category: 'Utilities', icon: 'QrCode', type: 'internal', status: 'published' },
  { id: 'barcode-generator', name: 'Barcode Generator', slug: 'barcode-generator', description: 'Generate barcodes from numbers or text.', category: 'Utilities', icon: 'Barcode', type: 'internal', status: 'published' },
  { id: 'password-generator', name: 'Password Generator', slug: 'password-generator', description: 'Generate secure passwords locally in your browser.', category: 'Utilities', icon: 'Key', type: 'internal', status: 'published' },
  { id: 'age-calculator', name: 'Age Calculator', slug: 'age-calculator', description: 'Calculate age in years, months and days from date of birth.', category: 'Calculators', icon: 'Calendar', type: 'internal', status: 'published' },
  { id: 'percentage-calculator', name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'Various percentage calculations for everyday math.', category: 'Calculators', icon: 'Percent', type: 'internal', status: 'published' },
  { id: 'cgpa-calculator', name: 'CGPA Calculator', slug: 'cgpa-calculator', description: 'Calculate CGPA from subject grades and credits.', category: 'Education', icon: 'School', type: 'internal', status: 'published' },
  { id: 'word-counter', name: 'Word Counter', slug: 'word-counter', description: 'Count words, characters, sentences and reading time.', category: 'Utilities', icon: 'Type', type: 'internal', status: 'published' },
  { id: 'text-case-converter', name: 'Text Case Converter', slug: 'text-case-converter', description: 'Convert text to uppercase, lowercase, title case and more.', category: 'Utilities', icon: 'Text', type: 'internal', status: 'published' },
  { id: 'json-formatter', name: 'JSON Formatter', slug: 'json-formatter', description: 'Format, minify and validate JSON locally.', category: 'Developers', icon: 'Code', type: 'internal', status: 'published' },
  { id: 'image-compressor', name: 'Image Compressor', slug: 'image-compressor', description: 'Compress images locally without uploading to a server.', category: 'Utilities', icon: 'Image', type: 'internal', status: 'published' },
];

export default TOOL_REGISTRY;
