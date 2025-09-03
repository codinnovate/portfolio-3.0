interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  location: string;
  blog: string;
  email: string;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
  created_at: string; // Add this field
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  topics: string[];
  updated_at: string;
  pushed_at: string;
}

interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  created_at: string;
  payload: any;
}

interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionsResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        weeks: ContributionWeek[];
        totalContributions: number;
      };
    };
  };
}

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'codinnovate';

export async function fetchGitHubUser(): Promise<GitHubUser | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: GITHUB_TOKEN ? {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      } : {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    return null;
  }
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, {
      headers: GITHUB_TOKEN ? {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      } : {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();
    return repos.filter((repo: GitHubRepo) => !repo.name.includes('fork'));
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}

// Add new function for pinned repositories
export async function fetchGitHubPinnedRepos(): Promise<GitHubRepo[]> {
  try {
    const query = `
      query {
        user(login: "${GITHUB_USERNAME}") {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                id
                name
                description
                primaryLanguage {
                  name
                }
                stargazerCount
                forkCount
                url
                repositoryTopics(first: 10) {
                  nodes {
                    topic {
                      name
                    }
                  }
                }
                updatedAt
                pushedAt
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return [];
    }

    // Transform GraphQL response to match GitHubRepo interface
    const pinnedRepos = data.data.user.pinnedItems.nodes.map((repo: any) => ({
      id: parseInt(repo.id),
      name: repo.name,
      description: repo.description || '',
      language: repo.primaryLanguage?.name || '',
      stargazers_count: repo.stargazerCount,
      forks_count: repo.forkCount,
      html_url: repo.url,
      topics: repo.repositoryTopics.nodes.map((topic: any) => topic.topic.name),
      updated_at: repo.updatedAt,
      pushed_at: repo.pushedAt,
    }));

    return pinnedRepos;
  } catch (error) {
    console.error('Error fetching GitHub pinned repos:', error);
    // Fallback to regular repos if pinned repos fail
    return fetchGitHubRepos();
  }
}

export async function fetchGitHubEvents(): Promise<GitHubEvent[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=10`, {
      headers: GITHUB_TOKEN ? {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      } : {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub events:', error);
    return [];
  }
}

export async function fetchGitHubContributions(year: number = new Date().getFullYear()): Promise<{ contributions: ContributionDay[]; totalContributions: number }> {
  try {
    const startDate = new Date(`${year}-01-01T00:00:00Z`);
    const endDate = new Date(`${year}-12-31T23:59:59Z`);

    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      username: GITHUB_USERNAME,
      from: startDate.toISOString(),
      to: endDate.toISOString(),
    };

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL API error: ${response.status}`);
    }

    const data: { data: ContributionsResponse } = await response.json();
    const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
    const totalContributions = data.data.user.contributionsCollection.contributionCalendar.totalContributions;
    
    const contributions = weeks.flatMap(week => week.contributionDays);
    
    return { contributions, totalContributions };
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    // Return fallback data if API fails
    return generateFallbackContributions(year);
  }
}

function generateFallbackContributions(year: number): { contributions: ContributionDay[]; totalContributions: number } {
  const contributions: ContributionDay[] = [];
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    contributions.push({
      date: d.toISOString().split('T')[0],
      contributionCount: Math.floor(Math.random() * 5),
      contributionLevel: ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'][Math.floor(Math.random() * 5)] as any
    });
  }
  
  const totalContributions = contributions.reduce((sum, day) => sum + day.contributionCount, 0);
  return { contributions, totalContributions };
}

export function formatEventDescription(event: GitHubEvent): string {
  const repoName = event.repo.name.split('/')[1];
  
  switch (event.type) {
    case 'PushEvent':
      const commitCount = event.payload.commits?.length || 1;
      return `Pushed ${commitCount} commit${commitCount > 1 ? 's' : ''} to ${repoName}`;
    case 'CreateEvent':
      if (event.payload.ref_type === 'repository') {
        return `Created repository ${repoName}`;
      }
      return `Created ${event.payload.ref_type} in ${repoName}`;
    case 'IssuesEvent':
      return `${event.payload.action === 'opened' ? 'Opened' : 'Closed'} issue in ${repoName}`;
    case 'PullRequestEvent':
      return `${event.payload.action === 'opened' ? 'Opened' : 'Closed'} pull request in ${repoName}`;
    case 'WatchEvent':
      return `Starred ${repoName}`;
    case 'ForkEvent':
      return `Forked ${repoName}`;
    case 'ReleaseEvent':
      return `Released ${event.payload.release.tag_name} in ${repoName}`;
    default:
      return `Activity in ${repoName}`;
  }
}

export function getEventColor(eventType: string): string {
  const colors: { [key: string]: string } = {
    'PushEvent': '#238636',
    'CreateEvent': '#d73a49',
    'IssuesEvent': '#f85149',
    'PullRequestEvent': '#a5a5a5',
    'WatchEvent': '#ffd33d',
    'ForkEvent': '#58a6ff',
    'ReleaseEvent': '#7c3aed',
  };
  return colors[eventType] || '#7d8590';
}

export function getLanguageColor(language: string): string {
  const colors: { [key: string]: string } = {
    'TypeScript': '#3178c6',
    'JavaScript': '#f1e05a',
    'Python': '#3572A5',
    'Java': '#b07219',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'C++': '#f34b7d',
    'C': '#555555',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Swift': '#fa7343',
    'Kotlin': '#A97BFF',
    'Dart': '#00B4AB',
    'HTML': '#e34c26',
    'CSS': '#1572B6',
    'Vue': '#4FC08D',
    'Svelte': '#ff3e00',
  };
  return colors[language] || '#8b949e';
}

// Add new interfaces for enhanced contribution data
interface ContributionStats {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  averagePerDay: number;
  mostActiveDay: string;
  contributionsByMonth: { [key: string]: number };
  contributionsByDayOfWeek: { [key: string]: number };
}

interface LanguageStats {
  language: string;
  count: number;
  percentage: number;
  color: string;
}

// Add enhanced contribution analytics function
export function analyzeContributions(contributions: ContributionDay[]): ContributionStats {
  if (contributions.length === 0) {
    return {
      totalContributions: 0,
      currentStreak: 0,
      longestStreak: 0,
      averagePerDay: 0,
      mostActiveDay: '',
      contributionsByMonth: {},
      contributionsByDayOfWeek: {}
    };
  }

  const totalContributions = contributions.reduce((sum, day) => sum + day.contributionCount, 0);
  const averagePerDay = totalContributions / contributions.length;

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Start from most recent date
  const sortedContributions = [...contributions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  for (let i = 0; i < sortedContributions.length; i++) {
    if (sortedContributions[i].contributionCount > 0) {
      tempStreak++;
      if (i === 0) currentStreak = tempStreak;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
      if (i === 0) currentStreak = 0;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Find most active day
  const mostActiveDay = contributions.reduce((max, day) => 
    day.contributionCount > max.contributionCount ? day : max
  ).date;

  // Group by month
  const contributionsByMonth: { [key: string]: number } = {};
  contributions.forEach(day => {
    const month = day.date.substring(0, 7); // YYYY-MM format
    contributionsByMonth[month] = (contributionsByMonth[month] || 0) + day.contributionCount;
  });

  // Group by day of week
  const contributionsByDayOfWeek: { [key: string]: number } = {
    'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 'Friday': 0, 'Saturday': 0
  };
  
  contributions.forEach(day => {
    const dayOfWeek = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' });
    contributionsByDayOfWeek[dayOfWeek] += day.contributionCount;
  });

  return {
    totalContributions,
    currentStreak,
    longestStreak,
    averagePerDay,
    mostActiveDay,
    contributionsByMonth,
    contributionsByDayOfWeek
  };
}

// Add function to get language statistics from repositories
export function getLanguageStats(repos: GitHubRepo[]): LanguageStats[] {
  const languageCounts: { [key: string]: number } = {};
  
  repos.forEach(repo => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });

  const totalRepos = Object.values(languageCounts).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(languageCounts)
    .map(([language, count]) => ({
      language,
      count,
      percentage: (count / totalRepos) * 100,
      color: getLanguageColor(language)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8 languages
}

// Add function to get contribution intensity for better heatmap
export function getContributionIntensity(contributions: ContributionDay[]): string {
  const totalDays = contributions.length;
  const activeDays = contributions.filter(day => day.contributionCount > 0).length;
  const intensity = activeDays / totalDays;
  
  if (intensity >= 0.8) return 'Very High';
  if (intensity >= 0.6) return 'High';
  if (intensity >= 0.4) return 'Medium';
  if (intensity >= 0.2) return 'Low';
  return 'Very Low';
}

// Add function to get account age and generate year options
export function getAccountYearsSince(createdAt: string): number[] {
  const accountCreationYear = new Date(createdAt).getFullYear();
  const currentYear = new Date().getFullYear();
  
  const yearOptions = [];
  for (let year = currentYear; year >= accountCreationYear && year >= 2018; year--) {
    yearOptions.push(year);
  }
  
  return yearOptions;
}



// Add function to format year option labels
export function formatYearOption(year: number, createdAt: string): string {
  return year.toString();
}

// Generate GitHub-based achievements
interface Achievement {
  title: string;
  description: string;
  date: string;
  category: string;
  icon: string;
  link?: string;
}

export async function generateGitHubAchievements(): Promise<Achievement[]> {
  try {
    const [user, repos, events] = await Promise.all([
      fetchGitHubUser(),
      fetchGitHubRepos(),
      fetchGitHubEvents()
    ]);

    if (!user || !repos) return [];

    const achievements: Achievement[] = [];
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Calculate total stars across all repositories
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const languages = Array.from(new Set(repos.map(repo => repo.language).filter(Boolean)));
    
    // Starstruck Achievement - Based on total stars
    if (totalStars >= 16) {
      let level = 'Bronze';
      if (totalStars >= 4096) level = 'Gold';
      else if (totalStars >= 512) level = 'Silver';
      
      achievements.push({
        title: `Starstruck ${level}`,
        description: `Earned ${totalStars} stars across all repositories`,
        date: currentDate,
        category: 'Recognition',
        icon: 'Star'
      });
    }
    
    // Repository Milestone Achievements
    if (user.public_repos >= 10) {
      achievements.push({
        title: 'Prolific Creator',
        description: `Created ${user.public_repos} public repositories`,
        date: currentDate,
        category: 'Development',
        icon: 'FolderGit2'
      });
    }
    
    // Language Diversity Achievement
    if (languages.length >= 5) {
      achievements.push({
        title: 'Polyglot Developer',
        description: `Proficient in ${languages.length} programming languages: ${languages.slice(0, 3).join(', ')}${languages.length > 3 ? ` and ${languages.length - 3} more` : ''}`,
        date: currentDate,
        category: 'Skills',
        icon: 'Code2'
      });
    }
    
    // Community Engagement Achievement
    if (user.followers >= 10) {
      let level = 'Community Member';
      if (user.followers >= 100) level = 'Community Leader';
      else if (user.followers >= 50) level = 'Community Contributor';
      
      achievements.push({
        title: level,
        description: `Gained ${user.followers} followers on GitHub`,
        date: currentDate,
        category: 'Community',
        icon: 'Users'
      });
    }
    
    // Fork Achievement
    if (totalForks >= 5) {
      achievements.push({
        title: 'Fork Magnet',
        description: `Projects have been forked ${totalForks} times`,
        date: currentDate,
        category: 'Impact',
        icon: 'GitFork'
      });
    }
    
    // Account Longevity Achievement
    const accountAge = new Date().getFullYear() - new Date(user.created_at).getFullYear();
    if (accountAge >= 2) {
      achievements.push({
        title: 'Veteran Developer',
        description: `Active on GitHub for ${accountAge} years since ${new Date(user.created_at).getFullYear()}`,
        date: currentDate,
        category: 'Milestone',
        icon: 'Calendar'
      });
    }
    
    // Recent Activity Achievement
    const recentEvents = events.filter(event => {
      const eventDate = new Date(event.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return eventDate > thirtyDaysAgo;
    });
    
    if (recentEvents.length >= 10) {
      achievements.push({
        title: 'Active Contributor',
        description: `${recentEvents.length} contributions in the last 30 days`,
        date: currentDate,
        category: 'Activity',
        icon: 'Activity'
      });
    }
    
    // Popular Repository Achievement
    const mostStarredRepo = repos.reduce((max, repo) => 
      repo.stargazers_count > max.stargazers_count ? repo : max, 
      repos[0] || { stargazers_count: 0, name: '' }
    );
    
    if (mostStarredRepo.stargazers_count >= 10) {
      achievements.push({
        title: 'Project Spotlight',
        description: `"${mostStarredRepo.name}" received ${mostStarredRepo.stargazers_count} stars`,
        date: currentDate,
        category: 'Recognition',
        icon: 'Spotlight',
        link: `https://github.com/${user.login}/${mostStarredRepo.name}`
      });
    }
    
    return achievements;
  } catch (error) {
    console.error('Error generating GitHub achievements:', error);
    return [];
  }
}
// export function formatYearOption(years: number, createdAt: string): string {
//   const accountCreationYear = new Date(createdAt).getFullYear();
//   const currentYear = new Date().getFullYear();
//   const targetYear = currentYear - years + 1;
  
//   if (years === 1) return 'Last year';
//   if (targetYear <= accountCreationYear) return `All time (since ${accountCreationYear})`;
//   return `Last ${years} years (since ${targetYear})`;
// }