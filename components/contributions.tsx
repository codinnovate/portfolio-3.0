'use client';

import { useState } from 'react';
import { getContributionIntensity, formatYearOption } from '@/lib/github';

interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';
}

interface ContributionStats {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  averagePerDay: number;
  mostActiveDay: string;
  contributionsByMonth: { [key: string]: number };
  contributionsByDayOfWeek: { [key: string]: number };
}

interface ContributionsProps {
  contributions: ContributionDay[];
  totalContributions: number;
  contributionYears: number;
  setContributionYears: (year: number) => void;
  contributionStats: ContributionStats | null;
  availableYears: number[];
  accountCreatedAt: string;
}

export default function Contributions({
  contributions,
  totalContributions,
  contributionYears,
  setContributionYears,
  contributionStats,
  availableYears,
  accountCreatedAt
}: ContributionsProps) {
  const [showDetailedStats, setShowDetailedStats] = useState(false);

  const getContributionLevel = (level: string): number => {
    switch (level) {
      case 'NONE': return 0;
      case 'FIRST_QUARTILE': return 1;
      case 'SECOND_QUARTILE': return 2;
      case 'THIRD_QUARTILE': return 3;
      case 'FOURTH_QUARTILE': return 4;
      default: return 0;
    }
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-[#f0f6fc]">Contribution Activity</h2>
        <div className="flex items-center space-x-3">
          <select
            value={contributionYears}
            onChange={(e) => setContributionYears(Number(e.target.value))}
            className="bg-[#21262d] border border-[#30363d] text-[#e6edf3] text-xs rounded px-2 py-1 focus:border-[#58a6ff] focus:outline-none max-w-[100px] w-full"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {formatYearOption(year, accountCreatedAt)}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowDetailedStats(!showDetailedStats)}
            className="text-xs text-[#58a6ff] hover:text-[#79c0ff] transition-colors"
          >
            {showDetailedStats ? 'Hide' : 'Show'} Stats
          </button>
        </div>
      </div>
      
      {/* Compact Statistics - Only show when expanded */}
      {contributionStats && showDetailedStats && (
        <div className="grid grid-cols-4 gap-3 mb-3 p-3 bg-[#0d1117] rounded border border-[#21262d]">
          <div className="text-center">
            <div className="text-sm font-semibold text-[#39d353]">{contributionStats.currentStreak}</div>
            <div className="text-xs text-[#7d8590]">Streak</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-[#f85149]">{contributionStats.longestStreak}</div>
            <div className="text-xs text-[#7d8590]">Best</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-[#58a6ff]">{contributionStats.averagePerDay.toFixed(1)}</div>
            <div className="text-xs text-[#7d8590]">Avg/Day</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-[#ffd33d]">{getContributionIntensity(contributions)}</div>
            <div className="text-xs text-[#7d8590]">Level</div>
          </div>
        </div>
      )}
      
      {/* Compact Contribution Heatmap with Month Labels */}
      <div className="overflow-x-auto mb-3">
        {/* Month Labels */}
        <div className="flex mb-1 text-xs text-[#7d8590] min-w-max">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
            <div key={month} className="flex-1 text-center" style={{ minWidth: '44px' }}>
              {month}
            </div>
          ))}
        </div>
        
        {/* Contribution Grid */}
        <div className="grid grid-cols-53 gap-0.5 min-w-max">
          {contributions.map((day, index) => {
            const level = getContributionLevel(day.contributionLevel);
            const levelColors = [
              'bg-[#161b22] border border-[#30363d]',
              'bg-[#0e4429]',
              'bg-[#006d32]',
              'bg-[#26a641]',
              'bg-[#39d353]'
            ];
            
            return (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-sm ${levelColors[level]} hover:ring-1 hover:ring-[#58a6ff] transition-all cursor-pointer`}
                title={`${day.contributionCount} contributions on ${day.date}`}
              ></div>
            );
          })}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-[#7d8590]">
        <span>{totalContributions} contributions in the last year</span>
        <div className="flex items-center space-x-2">
          <span>Less</span>
          <div className="flex space-x-1">
            <div className="w-2.5 h-2.5 bg-[#161b22] border border-[#30363d] rounded-sm"></div>
            <div className="w-2.5 h-2.5 bg-[#0e4429] rounded-sm"></div>
            <div className="w-2.5 h-2.5 bg-[#006d32] rounded-sm"></div>
            <div className="w-2.5 h-2.5 bg-[#26a641] rounded-sm"></div>
            <div className="w-2.5 h-2.5 bg-[#39d353] rounded-sm"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}