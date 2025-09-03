import { Award, ExternalLink, Calendar } from 'lucide-react';
import { IAchievement } from '@/lib/types';

interface AchievementsProps {
  achievements: IAchievement[];
}

const getCategoryColor = (category: IAchievement['category']) => {
  switch (category) {
    case 'certification':
      return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'award':
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    case 'project':
      return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'recognition':
      return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    default:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
};

const getCategoryLabel = (category: IAchievement['category']) => {
  switch (category) {
    case 'certification':
      return 'Certification';
    case 'award':
      return 'Award';
    case 'project':
      return 'Project';
    case 'recognition':
      return 'Recognition';
    default:
      return 'Achievement';
  }
};

export default function Achievements({ achievements }: AchievementsProps) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <Award className="w-5 h-5 text-[#58a6ff] mr-2" />
        <h3 className="text-lg font-semibold text-[#f0f6fc]">Achievements</h3>
      </div>
      
      <div className="space-y-4">
        {achievements.map((achievement, index) => (
          <div 
            key={index} 
            className="group p-4 bg-[#0d1117] border border-[#30363d] rounded-lg hover:border-[#58a6ff] transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <h4 className="text-[#f0f6fc] font-medium group-hover:text-[#58a6ff] transition-colors">
                    {achievement.credentialUrl ? (
                      <a 
                        href={achievement.credentialUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center hover:text-[#58a6ff] transition-colors"
                      >
                        {achievement.title}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      achievement.title
                    )}
                  </h4>
                  <p className="text-sm text-[#7d8590] mb-1">{achievement.issuer}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(achievement.category)}`}>
                  {getCategoryLabel(achievement.category)}
                </span>
                <div className="flex items-center text-xs text-[#7d8590]">
                  <Calendar className="w-3 h-3 mr-1" />
                  {achievement.date}
                </div>
              </div>
            </div>
            
            <p className="text-sm text-[#e6edf3] leading-relaxed">
              {achievement.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}