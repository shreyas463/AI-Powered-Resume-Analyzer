export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
}

export const templates: ResumeTemplate[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'A clean and modern design with a sidebar for key information',
    thumbnail: '/templates/modern.png',
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      text: '#1f2937',
      background: '#ffffff'
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Traditional layout perfect for corporate positions',
    thumbnail: '/templates/professional.png',
    colors: {
      primary: '#1e293b',
      secondary: '#334155',
      text: '#1f2937',
      background: '#ffffff'
    }
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Unique design for creative professionals',
    thumbnail: '/templates/creative.png',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      text: '#1f2937',
      background: '#ffffff'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant design that focuses on content',
    thumbnail: '/templates/minimal.png',
    colors: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      text: '#1f2937',
      background: '#ffffff'
    }
  }
];
