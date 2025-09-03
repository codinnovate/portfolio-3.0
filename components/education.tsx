'use client';

import { ExternalLink, GraduationCap } from 'lucide-react';
import { IEducation } from '@/lib/types';

interface EducationProps {
  education: IEducation[];
}

export default function Education({ education }: EducationProps) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#f0f6fc]">Education</h2>
        <div className="text-xs text-[#7d8590]">
          {education.length} {education.length === 1 ? 'institution' : 'institutions'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {education.map((edu, index) => (
          <div key={index} className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4 hover:border-[#30363d] transition-colors group">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <img
                  src={edu.logo}
                  alt={edu.institution}
                  className="w-8 h-8 rounded-full border border-[#30363d] group-hover:border-[#58a6ff] transition-colors flex-shrink-0"
                />
                <h3 className="text-sm font-semibold text-[#58a6ff] group-hover:text-[#79c0ff] transition-colors">
                  <a href={edu.website} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    {edu.institution}
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </h3>
              </div>
              <span className="text-xs text-[#7d8590] flex-shrink-0">{edu.period}</span>
            </div>
            
            <div className="mb-3">
              <p className="text-sm font-medium text-[#f0f6fc] mb-1 flex items-center">
                <GraduationCap className="w-3 h-3 mr-1" />
                {edu.degree}
              </p>
              <p className="text-xs text-[#7d8590] leading-relaxed line-clamp-2">
                {edu.description}
              </p>
            </div>
            
            {edu.subjects.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {edu.subjects.slice(0, 3).map((subject) => (
                  <span
                    key={subject}
                    className="px-2 py-1 bg-[#1c2128] text-[#58a6ff] text-xs rounded-full border border-[#30363d] hover:border-[#58a6ff] transition-colors"
                  >
                    {subject}
                  </span>
                ))}
                {edu.subjects.length > 3 && (
                  <span className="text-xs text-[#7d8590] self-center">+{edu.subjects.length - 3}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}