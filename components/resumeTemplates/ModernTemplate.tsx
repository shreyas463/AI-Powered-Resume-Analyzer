'use client'

import { FormData, Experience, Education, Certification } from '@/app/create/page'

interface ModernTemplateProps {
  formData: FormData
  colors: {
    primary: string
    secondary: string
    text: string
    background: string
  }
}

export default function ModernTemplate({ formData, colors }: ModernTemplateProps) {
  return (
    <div className="flex" style={{ backgroundColor: colors.background, color: colors.text }}>
      {/* Sidebar */}
      <div className="w-1/3 p-8" style={{ backgroundColor: colors.primary }}>
        <div className="text-white">
          <h1 className="text-2xl font-bold mb-2">{formData.personalInfo.fullName}</h1>
          <div className="mb-8">
            <p>{formData.personalInfo.email}</p>
            <p>{formData.personalInfo.phone}</p>
            <p>{formData.personalInfo.location}</p>
            {formData.personalInfo.linkedIn && (
              <p className="mt-2">
                <a href={formData.personalInfo.linkedIn} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </p>
            )}
            {formData.personalInfo.portfolio && (
              <p>
                <a href={formData.personalInfo.portfolio} target="_blank" rel="noopener noreferrer">
                  Portfolio
                </a>
              </p>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3" style={{ color: colors.secondary }}>
              SKILLS
            </h2>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Technical</h3>
              <ul className="list-disc list-inside">
                {formData.skills.technical.map((skill: string, index: number) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Professional</h3>
              <ul className="list-disc list-inside">
                {formData.skills.soft.map((skill: string, index: number) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>

          {formData.certifications.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.secondary }}>
                CERTIFICATIONS
              </h2>
              {formData.certifications.map((cert: Certification, index: number) => (
                <div key={index} className="mb-3">
                  <h3 className="font-medium">{cert.name}</h3>
                  <p>{cert.issuer}</p>
                  <p className="text-sm">{cert.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3" style={{ color: colors.primary }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p>{formData.summary}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3" style={{ color: colors.primary }}>
            WORK EXPERIENCE
          </h2>
          {formData.experience.map((exp: Experience, index: number) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{exp.title}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <p className="text-gray-600">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
              </div>
              <p className="text-gray-600 mb-2">{exp.location}</p>
              <ul className="list-disc list-inside">
                {exp.responsibilities.map((resp: string, respIndex: number) => (
                  <li key={respIndex} className="text-gray-700">{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3" style={{ color: colors.primary }}>
            EDUCATION
          </h2>
          {formData.education.map((edu: Education, index: number) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.school}</p>
                </div>
                <p className="text-gray-600">Graduated: {edu.graduationDate}</p>
              </div>
              <p className="text-gray-600 mb-2">{edu.location}</p>
              {edu.gpa && <p className="text-gray-600 mb-2">GPA: {edu.gpa}</p>}
              {edu.highlights.length > 0 && (
                <ul className="list-disc list-inside">
                  {edu.highlights.map((highlight: string, highlightIndex: number) => (
                    <li key={highlightIndex} className="text-gray-700">{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
