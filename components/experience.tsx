'use client';

import Education from './education';
import Achievements from './achievements';
import { Company, IEducation, IAchievement } from '@/lib/types';

interface ExperienceProps {
  companies: Company[];
  education: IEducation[];
  skills: string[];
  achievements: IAchievement[];
}

export default function Experience({ companies, education, skills, achievements }: ExperienceProps) {
  return (
    <>
      {/* Skills Section */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-[#f0f6fc] mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-[#1c2128] text-[#7d8590] text-xs rounded border border-[#30363d] hover:border-[#58a6ff] hover:text-[#58a6ff] transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Work Experience Section */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-[#f0f6fc] mb-3">Work Experience</h3>
        <div className="space-y-4">
          {companies.map((company, index) => (
            <div key={index} className="flex items-start space-x-3 group">
              <img
                src={company.logo}
                alt={company.name}
                className="w-8 h-8 rounded-full border border-[#30363d] group-hover:border-[#58a6ff] transition-colors"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-[#f0f6fc] group-hover:text-[#58a6ff] transition-colors">
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-[#58a6ff] transition-colors"
                    >
                      {company.name}
                    </a>
                  </h4>
                  <span className="text-xs text-[#7d8590]">{company.period}</span>
                </div>
                <p className="text-xs text-[#58a6ff] mb-1">{company.role}</p>
                <p className="text-xs text-[#7d8590] leading-relaxed mb-2">{company.description}</p>
                <div className="flex flex-wrap gap-1">
                  {company.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 bg-[#1c2128] text-[#7d8590] text-xs rounded border border-[#30363d]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}