import React, { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { updatePageMeta } from '../../lib/seo';
import {
  ResumeData,
  PersonalInfo,
  Education,
  Experience,
  Skill,
  Project,
  Certification,
  Language,
  STORAGE_KEY,
  TemplateName,
} from './types';
import { renderResumeHtml } from './ResumeTemplates';

const defaultData: ResumeData = {
  personal: { fullName: 'Your Name', title: 'Professional Title', email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
  summary: '',
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  template: 'modern',
};

const useLocalResume = () => {
  const [data, setData] = useState<ResumeData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as ResumeData;
    } catch (e) {}
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  return [data, setData] as const;
};

const ResumeBuilder: React.FC = () => {
  const [data, setData] = useLocalResume();
  const [skillInput, setSkillInput] = useState('');

  useEffect(()=>{ updatePageMeta({ title: 'Resume Builder - Toolly', description: "Create a professional resume online with Toolly's free Resume Builder." }); },[]);

  const updatePersonal = (patch: Partial<PersonalInfo>) => setData(d => ({ ...d, personal: { ...d.personal, ...patch } }));

  const addEducation = () => setData(d=>({ ...d, education: [...d.education, { id: uuidv4(), degree: '', institution: '', location: '', startDate: '', endDate: '', description: '' }] }));
  const updateEducation = (id: string, patch: Partial<Education>) => setData(d=>({ ...d, education: d.education.map(e=> e.id===id ? { ...e, ...patch } : e) }));
  const removeEducation = (id: string) => setData(d=>({ ...d, education: d.education.filter(e=>e.id!==id) }));

  const addExperience = () => setData(d=>({ ...d, experience: [...d.experience, { id: uuidv4(), title: '', company: '', location: '', startDate: '', endDate: '', description: '' }] }));
  const updateExperience = (id: string, patch: Partial<Experience>) => setData(d=>({ ...d, experience: d.experience.map(e=> e.id===id ? { ...e, ...patch } : e) }));
  const removeExperience = (id: string) => setData(d=>({ ...d, experience: d.experience.filter(e=>e.id!==id) }));

  const addSkill = (name: string) => {
    if (!name.trim()) return;
    setData(d=>({ ...d, skills: [...d.skills, { id: uuidv4(), name: name.trim() }] }));
    setSkillInput('');
  };
  const removeSkill = (id: string) => setData(d=>({ ...d, skills: d.skills.filter(s=>s.id!==id) }));

  const addProject = () => setData(d=>({ ...d, projects: [...d.projects, { id: uuidv4(), name: '', description: '', technologies: '', url: '' }] }));
  const updateProject = (id: string, patch: Partial<Project>) => setData(d=>({ ...d, projects: d.projects.map(p=> p.id===id ? { ...p, ...patch } : p) }));
  const removeProject = (id: string) => setData(d=>({ ...d, projects: d.projects.filter(p=>p.id!==id) }));

  const addCertification = () => setData(d=>({ ...d, certifications: [...d.certifications, { id: uuidv4(), name: '', issuer: '', date: '', url: '' }] }));
  const updateCertification = (id: string, patch: Partial<Certification>) => setData(d=>({ ...d, certifications: d.certifications.map(c=> c.id===id ? { ...c, ...patch } : c) }));
  const removeCertification = (id: string) => setData(d=>({ ...d, certifications: d.certifications.filter(c=>c.id!==id) }));

  const addLanguage = () => setData(d=>({ ...d, languages: [...d.languages, { id: uuidv4(), name: '', proficiency: '' }] }));
  const updateLanguage = (id: string, patch: Partial<Language>) => setData(d=>({ ...d, languages: d.languages.map(l=> l.id===id ? { ...l, ...patch } : l) }));
  const removeLanguage = (id: string) => setData(d=>({ ...d, languages: d.languages.filter(l=>l.id!==id) }));

  const clearResume = () => {
    if (!confirm('Clear the resume? This will erase local data.')) return;
    localStorage.removeItem(STORAGE_KEY);
    setData(defaultData);
  };

  const setTemplate = (t: TemplateName) => setData(d=>({ ...d, template: t }));

  const previewHtml = useMemo(()=> renderResumeHtml(data, data.template), [data]);

  const downloadPdf = async () => {
    // Use browser print to PDF via opening a new window with printable HTML
    const w = window.open('', '_blank', 'noopener');
    if (!w) return alert('Unable to open a new window for PDF generation.');
    w.document.write(previewHtml);
    w.document.close();
    // Wait for render
    setTimeout(()=>{ w.print(); }, 500);
  };

  return (
    <div className="min-h-screen bg-[#000] text-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Resume Builder</h1>
              <p className="text-sm text-[#A1A1AA]">Build a professional resume with live preview.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={downloadPdf} className="px-4 py-2 bg-white text-black rounded">Download PDF</button>
              <button onClick={clearResume} className="px-4 py-2 border rounded">Clear Resume</button>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input value={data.personal.fullName} onChange={(e)=>updatePersonal({ fullName: e.target.value })} placeholder="Full name" className="p-2 bg-[#000] border rounded" />
              <input value={data.personal.title} onChange={(e)=>updatePersonal({ title: e.target.value })} placeholder="Professional title" className="p-2 bg-[#000] border rounded" />
              <input value={data.personal.email} onChange={(e)=>updatePersonal({ email: e.target.value })} placeholder="Email" className="p-2 bg-[#000] border rounded" />
              <input value={data.personal.phone} onChange={(e)=>updatePersonal({ phone: e.target.value })} placeholder="Phone" className="p-2 bg-[#000] border rounded" />
              <input value={data.personal.location} onChange={(e)=>updatePersonal({ location: e.target.value })} placeholder="Location" className="p-2 bg-[#000] border rounded" />
              <input value={data.personal.linkedin} onChange={(e)=>updatePersonal({ linkedin: e.target.value })} placeholder="LinkedIn" className="p-2 bg-[#000] border rounded" />
              <input value={data.personal.github} onChange={(e)=>updatePersonal({ github: e.target.value })} placeholder="GitHub" className="p-2 bg-[#000] border rounded" />
              <input value={data.personal.website} onChange={(e)=>updatePersonal({ website: e.target.value })} placeholder="Website" className="p-2 bg-[#000] border rounded" />
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Professional Summary</h2>
            <textarea value={data.summary} onChange={(e)=>setData(d=>({ ...d, summary: e.target.value }))} className="w-full p-2 bg-[#000] border rounded" rows={4}></textarea>
          </div>

          <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Education</h2>
            {data.education.map((e)=> (
              <div key={e.id} className="mb-3 border-b pb-2">
                <div className="flex gap-2">
                  <input value={e.degree} onChange={(ev)=>updateEducation(e.id, { degree: ev.target.value })} placeholder="Degree" className="p-2 bg-[#000] border rounded flex-1" />
                  <input value={e.institution} onChange={(ev)=>updateEducation(e.id, { institution: ev.target.value })} placeholder="Institution" className="p-2 bg-[#000] border rounded flex-1" />
                </div>
                <div className="flex gap-2 mt-2">
                  <input value={e.location} onChange={(ev)=>updateEducation(e.id, { location: ev.target.value })} placeholder="Location" className="p-2 bg-[#000] border rounded" />
                  <input value={e.startDate} onChange={(ev)=>updateEducation(e.id, { startDate: ev.target.value })} placeholder="Start Date" className="p-2 bg-[#000] border rounded" />
                  <input value={e.endDate} onChange={(ev)=>updateEducation(e.id, { endDate: ev.target.value })} placeholder="End Date" className="p-2 bg-[#000] border rounded" />
                </div>
                <textarea value={e.description} onChange={(ev)=>updateEducation(e.id, { description: ev.target.value })} placeholder="Description" className="w-full p-2 bg-[#000] border rounded mt-2" rows={2}></textarea>
                <div className="flex justify-end mt-2">
                  <button onClick={()=>removeEducation(e.id)} className="px-3 py-1 border rounded">Remove</button>
                </div>
              </div>
            ))}
            <div>
              <button onClick={addEducation} className="px-4 py-2 bg-white text-black rounded">Add Education</button>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Work Experience</h2>
            {data.experience.map((e)=> (
              <div key={e.id} className="mb-3 border-b pb-2">
                <div className="flex gap-2">
                  <input value={e.title} onChange={(ev)=>updateExperience(e.id, { title: ev.target.value })} placeholder="Job title" className="p-2 bg-[#000] border rounded flex-1" />
                  <input value={e.company} onChange={(ev)=>updateExperience(e.id, { company: ev.target.value })} placeholder="Company" className="p-2 bg-[#000] border rounded flex-1" />
                </div>
                <div className="flex gap-2 mt-2">
                  <input value={e.location} onChange={(ev)=>updateExperience(e.id, { location: ev.target.value })} placeholder="Location" className="p-2 bg-[#000] border rounded" />
                  <input value={e.startDate} onChange={(ev)=>updateExperience(e.id, { startDate: ev.target.value })} placeholder="Start Date" className="p-2 bg-[#000] border rounded" />
                  <input value={e.endDate} onChange={(ev)=>updateExperience(e.id, { endDate: ev.target.value })} placeholder="End Date" className="p-2 bg-[#000] border rounded" />
                </div>
                <textarea value={e.description} onChange={(ev)=>updateExperience(e.id, { description: ev.target.value })} placeholder="Description" className="w-full p-2 bg-[#000] border rounded mt-2" rows={3}></textarea>
                <div className="flex justify-end mt-2">
                  <button onClick={()=>removeExperience(e.id)} className="px-3 py-1 border rounded">Remove</button>
                </div>
              </div>
            ))}
            <div>
              <button onClick={addExperience} className="px-4 py-2 bg-white text-black rounded">Add Experience</button>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Skills</h2>
            <div className="flex gap-2">
              <input value={skillInput} onChange={(e)=>setSkillInput(e.target.value)} placeholder="Add a skill and press Add" className="p-2 bg-[#000] border rounded flex-1" />
              <button onClick={()=>addSkill(skillInput)} className="px-4 py-2 bg-white text-black rounded">Add</button>
            </div>
            <div className="mt-2 flex flex-wrap">
              {data.skills.map(s=> (
                <div key={s.id} className="flex items-center gap-2 bg-[#111] px-3 py-1 rounded mr-2 mb-2">
                  <div>{s.name}</div>
                  <button onClick={()=>removeSkill(s.id)} className="text-sm">✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Projects</h2>
            {data.projects.map(p=> (
              <div key={p.id} className="mb-3 border-b pb-2">
                <input value={p.name} onChange={(ev)=>updateProject(p.id, { name: ev.target.value })} placeholder="Project name" className="p-2 bg-[#000] border rounded w-full" />
                <input value={p.technologies} onChange={(ev)=>updateProject(p.id, { technologies: ev.target.value })} placeholder="Technologies" className="p-2 bg-[#000] border rounded w-full mt-2" />
                <textarea value={p.description} onChange={(ev)=>updateProject(p.id, { description: ev.target.value })} placeholder="Description" className="w-full p-2 bg-[#000] border rounded mt-2" rows={2}></textarea>
                <input value={p.url} onChange={(ev)=>updateProject(p.id, { url: ev.target.value })} placeholder="URL" className="p-2 bg-[#000] border rounded w-full mt-2" />
                <div className="flex justify-end mt-2">
                  <button onClick={()=>removeProject(p.id)} className="px-3 py-1 border rounded">Remove</button>
                </div>
              </div>
            ))}
            <div><button onClick={addProject} className="px-4 py-2 bg-white text-black rounded">Add Project</button></div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Certifications</h2>
            {data.certifications.map(c=> (
              <div key={c.id} className="mb-3 border-b pb-2">
                <input value={c.name} onChange={(ev)=>updateCertification(c.id, { name: ev.target.value })} placeholder="Certification name" className="p-2 bg-[#000] border rounded w-full" />
                <input value={c.issuer} onChange={(ev)=>updateCertification(c.id, { issuer: ev.target.value })} placeholder="Issuing organization" className="p-2 bg-[#000] border rounded w-full mt-2" />
                <input value={c.date} onChange={(ev)=>updateCertification(c.id, { date: ev.target.value })} placeholder="Date" className="p-2 bg-[#000] border rounded w-full mt-2" />
                <input value={c.url} onChange={(ev)=>updateCertification(c.id, { url: ev.target.value })} placeholder="Credential URL" className="p-2 bg-[#000] border rounded w-full mt-2" />
                <div className="flex justify-end mt-2">
                  <button onClick={()=>removeCertification(c.id)} className="px-3 py-1 border rounded">Remove</button>
                </div>
              </div>
            ))}
            <div><button onClick={addCertification} className="px-4 py-2 bg-white text-black rounded">Add Certification</button></div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Languages</h2>
            {data.languages.map(l=> (
              <div key={l.id} className="mb-3 border-b pb-2">
                <div className="flex gap-2">
                  <input value={l.name} onChange={(ev)=>updateLanguage(l.id, { name: ev.target.value })} placeholder="Language" className="p-2 bg-[#000] border rounded flex-1" />
                  <input value={l.proficiency} onChange={(ev)=>updateLanguage(l.id, { proficiency: ev.target.value })} placeholder="Proficiency" className="p-2 bg-[#000] border rounded w-40" />
                </div>
                <div className="flex justify-end mt-2">
                  <button onClick={()=>removeLanguage(l.id)} className="px-3 py-1 border rounded">Remove</button>
                </div>
              </div>
            ))}
            <div><button onClick={addLanguage} className="px-4 py-2 bg-white text-black rounded">Add Language</button></div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Templates</h2>
            <div className="flex gap-2">
              <button onClick={()=>setTemplate('modern')} className={`px-3 py-1 rounded ${data.template==='modern'? 'bg-white text-black' : 'border'}`}>Modern</button>
              <button onClick={()=>setTemplate('classic')} className={`px-3 py-1 rounded ${data.template==='classic'? 'bg-white text-black' : 'border'}`}>Classic</button>
              <button onClick={()=>setTemplate('minimal')} className={`px-3 py-1 rounded ${data.template==='minimal'? 'bg-white text-black' : 'border'}`}>Minimal</button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white text-black rounded-lg p-4 print:p-0" style={{minHeight:400}}>
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
