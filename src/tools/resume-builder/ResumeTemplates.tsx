import React from 'react';
import { ResumeData, TemplateName } from './types';

export const renderResumeHtml = (data: ResumeData, template: TemplateName) => {
  // Lightweight HTML rendering used for PDF export (styles inline for portability)
  const { personal, summary, education, experience, skills, projects, certifications, languages } = data;

  const theme = {
    background: '#ffffff',
    text: '#111111',
    accent: '#111827',
    muted: '#4B5563',
    sectionBg: '#F8FAFC',
    border: '#E5E7EB',
    font: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  };

  const templateStyles = {
    modern: {
      headerBg: '#0F172A',
      headerText: '#FFFFFF',
      accent: '#2563EB',
      sectionTitle: '#334155',
    },
    classic: {
      headerBg: '#FFFFFF',
      headerText: '#111827',
      accent: '#111827',
      sectionTitle: '#111827',
    },
    minimal: {
      headerBg: '#FFFFFF',
      headerText: '#111827',
      accent: '#0F172A',
      sectionTitle: '#334155',
    },
  }[template];

  const renderSection = (title: string, content: string) => `
    <div style="margin-bottom:18px">
      <h3 style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${templateStyles.sectionTitle};margin:0 0 8px;font-weight:700">${title}</h3>
      <div>${content}</div>
    </div>
  `;

  const eduHtml = education.map(e => `
    <div style="margin-bottom:8px">
      <div style="font-weight:600">${e.degree} — ${e.institution}</div>
      <div style="font-size:12px;color:#444">${e.startDate || ''} ${e.endDate ? '— ' + e.endDate : ''} ${e.location ? '• ' + e.location : ''}</div>
      <div style="margin-top:4px">${e.description || ''}</div>
    </div>
  `).join('');

  const expHtml = experience.map(x => `
    <div style="margin-bottom:8px">
      <div style="font-weight:600">${x.title} — ${x.company}</div>
      <div style="font-size:12px;color:#444">${x.startDate || ''} ${x.endDate ? '— ' + x.endDate : ''} ${x.location ? '• ' + x.location : ''}</div>
      <div style="margin-top:4px">${x.description || ''}</div>
    </div>
  `).join('');

  const skillsHtml = skills.map(s => `<span style="display:inline-block;background:#f1f1f1;padding:4px 8px;border-radius:999px;margin:4px 4px 0 0;font-size:12px">${s.name}</span>`).join('');

  const projectsHtml = projects.map(p=>`<div style="margin-bottom:8px"><div style="font-weight:600">${p.name}</div><div style="font-size:12px;color:#444">${p.technologies || ''}</div><div style="margin-top:4px">${p.description || ''}</div></div>`).join('');

  const certsHtml = certifications.map(c=>`<div style="margin-bottom:6px"><div style="font-weight:600">${c.name}</div><div style="font-size:12px;color:#444">${c.issuer || ''} ${c.date ? '• ' + c.date : ''}</div></div>`).join('');

  const langsHtml = languages.map(l=>`<div style="display:inline-block;margin-right:8px;font-size:12px">${l.name} ${l.proficiency ? '• ' + l.proficiency : ''}</div>`).join('');

  const headerHtml = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding:18px;border:1px solid ${templateStyles.border};border-radius:16px;background:${templateStyles.headerBg};color:${templateStyles.headerText}">
      <div>
        <div style="font-size:24px;font-weight:800;letter-spacing:0.02em">${personal.fullName}</div>
        <div style="font-size:14px;color:${templateStyles.headerText};opacity:0.85;margin-top:4px">${personal.title}</div>
      </div>
      <div style="text-align:right;font-size:12px;color:${templateStyles.headerText};opacity:0.85;line-height:1.6">
        <div>${personal.email || ''}</div>
        <div>${personal.phone || ''}</div>
        <div>${personal.location || ''}</div>
      </div>
    </div>
  `;

  const body = `
    <div style="padding:20px;${commonStyles};background:${theme.background};color:${theme.text}">
      ${headerHtml}
      ${summary ? renderSection('Summary', `<div style="line-height:1.4;color:${theme.text};">${summary}</div>`) : ''}
      ${education.length ? renderSection('Education', eduHtml) : ''}
      ${experience.length ? renderSection('Experience', expHtml) : ''}
      ${skills.length ? renderSection('Skills', skillsHtml) : ''}
      ${projects.length ? renderSection('Projects', projectsHtml) : ''}
      ${certifications.length ? renderSection('Certifications', certsHtml) : ''}
      ${languages.length ? renderSection('Languages', langsHtml) : ''}
    </div>
  `;

  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Resume</title>
        <style>body{margin:0;padding:0}</style>
      </head>
      <body>
        ${body}
      </body>
    </html>
  `;

  return html;
};

export default function ResumeTemplates() { return null; }
