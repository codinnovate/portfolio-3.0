export interface Project {
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

export interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';
}

export interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  created_at: string;
  payload: any;
}

export interface ContributionStats {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  averagePerDay: number;
  mostActiveDay: string;
  contributionsByMonth: { [key: string]: number };
  contributionsByDayOfWeek: { [key: string]: number };
}

export interface LanguageStats {
  language: string;
  count: number;
  percentage: number;
  color: string;
}

export interface Company {
  name: string;
  role: string;
  period: string;
  logo: string;
  description: string;
  technologies: string[];
  website: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  period: string;
  logo: string;
  description: string;
  subjects: string[];
  website: string;
}

export interface IAchievement {
  title: string;
  description: string;
  date: string;
  category: 'certification' | 'award' | 'project' | 'recognition';
  issuer: string;
  credentialUrl?: string;
  icon: string;
}