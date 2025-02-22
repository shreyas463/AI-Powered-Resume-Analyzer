'use client'

import { templates, ResumeTemplate } from './resumeTemplates'
import TemplatePlaceholder from './TemplatePlaceholder'

interface TemplateSelectorProps {
  selectedTemplate: string
  onSelect: (templateId: string) => void
}

export default function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {templates.map((template) => (
        <div
          key={template.id}
          className={`
            relative cursor-pointer transition-all duration-200
            ${selectedTemplate === template.id 
              ? 'ring-2 ring-blue-500 scale-105' 
              : 'hover:scale-105'
            }
          `}
          onClick={() => onSelect(template.id)}
        >
          <TemplatePlaceholder type={template.id as 'modern' | 'professional' | 'creative' | 'minimal'} />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-white font-semibold mb-1">{template.name}</h3>
            <p className="text-gray-200 text-sm">{template.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
