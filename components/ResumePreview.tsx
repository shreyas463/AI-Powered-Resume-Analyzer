'use client'

import { useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { FiDownload } from 'react-icons/fi'
import { FormData } from '@/app/create/page'
import { templates } from './resumeTemplates'
import ModernTemplate from './resumeTemplates/ModernTemplate'

interface ResumePreviewProps {
  formData: FormData
  templateId: string
}

export default function ResumePreview({ formData, templateId }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null)
  const template = templates.find(t => t.id === templateId) || templates[0]

  const downloadPDF = async () => {
    if (!resumeRef.current) return

    const canvas = await html2canvas(resumeRef.current, {
      scale: 2,
      useCORS: true,
      logging: false
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    })

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(`${formData.personalInfo.fullName.replace(/\s+/g, '_')}_resume.pdf`)
  }

  const renderTemplate = () => {
    switch (templateId) {
      case 'modern':
        return <ModernTemplate formData={formData} colors={template.colors} />
      // Add other templates here as they are created
      default:
        return <ModernTemplate formData={formData} colors={template.colors} />
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg 
                   hover:bg-blue-600 transition-colors"
        >
          <FiDownload className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      <div
        ref={resumeRef}
        className="bg-white rounded-lg shadow-xl"
        style={{ minHeight: '1123px', width: '794px' }} // A4 size in pixels
      >
        {renderTemplate()}
      </div>
    </div>
  )
}
