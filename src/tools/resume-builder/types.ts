export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  technologies?: string;
  url?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer?: string;
  date?: string;
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency?: string;
}

export type TemplateName = 'modern' | 'classic' | 'minimal';

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  template: TemplateName;
}

export const STORAGE_KEY = 'resume-builder:data';
