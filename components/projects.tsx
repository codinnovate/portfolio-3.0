'use client';

import { Star, GitFork, ExternalLink } from 'lucide-react';
import { getLanguageColor } from '@/lib/github';
import { GitHubEvent } from '@/lib/types';

interface Project {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  topics: string[];
  updated_at: string;
}

interface ProjectsProps {
  projects: Project[];
  events: GitHubEvent[];
  formatTimeAgo: (dateString: string) => string;
  formatEventDescription: (event: GitHubEvent) => string;
  getEventColor: (eventType: string) => string;
}

export default function Projects({ 
  projects, 
  events,
  formatTimeAgo,
  formatEventDescription,
  getEventColor
}: ProjectsProps) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#f0f6fc]">Featured Projects</h2>
        <div className="text-xs text-[#7d8590]">
          {projects.length} repositories
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4 hover:border-[#30363d] transition-colors group">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-semibold text-[#58a6ff] group-hover:text-[#79c0ff] transition-colors">
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  {project.name}
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </h3>
            </div>
            
            <p className="text-xs text-[#7d8590] mb-3 leading-relaxed line-clamp-2">
              {project.description}
            </p>
            
            {project.topics.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {project.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-[#1c2128] text-[#58a6ff] text-xs rounded-full border border-[#30363d] hover:border-[#58a6ff] transition-colors"
                  >
                    {topic}
                  </span>
                ))}
                {project.topics.length > 3 && (
                  <span className="text-xs text-[#7d8590] self-center">+{project.topics.length - 3}</span>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-[#7d8590]">
              <div className="flex items-center space-x-4">
                {project.language && (
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-1" 
                      style={{ backgroundColor: getLanguageColor(project.language) }}
                    ></div>
                    {project.language}
                  </div>
                )}
                <div className="flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  {project.stars}
                </div>
                <div className="flex items-center">
                  <GitFork className="w-3 h-3 mr-1" />
                  {project.forks}
                </div>
              </div>
              <div className="text-xs text-[#7d8590]">
                Updated {formatTimeAgo(project.updated_at)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}