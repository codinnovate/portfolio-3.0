'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Link as LinkIcon, Mail, Github, Linkedin, X } from 'lucide-react';
import { fetchGitHubUser, fetchGitHubRepos, fetchGitHubEvents, fetchGitHubContributions, formatEventDescription, getEventColor, analyzeContributions, getLanguageStats, getAccountYearsSince } from '@/lib/github';
import { Project, ContributionDay, GitHubEvent, ContributionStats, LanguageStats } from '@/lib/types';
import { skills, companies, education, achievements } from '@/lib/constants';
import Contributions from '@/components/contributions';
import Experience from '@/components/experience';
import Projects from '@/components/projects';
import Education from '@/components/education';
import Achievements from '@/components/achievements';
import { getAchievements } from "@/lib/constants";

export default function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [contributionYears, setContributionYears] = useState(2025);
  const [loading, setLoading] = useState(true);
  const [contributionStats, setContributionStats] = useState<ContributionStats | null>(null);
  const [languageStats, setLanguageStats] = useState<LanguageStats[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([1, 2, 3]);
  const [accountCreatedAt, setAccountCreatedAt] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    loadGitHubData();
  }, []);

  useEffect(() => {
    if (mounted) {
      loadContributions();
    }
  }, [contributionYears, mounted]);

  const loadGitHubData = async () => {
    setLoading(true);
    try {
      const [userResponse, reposResponse, eventsResponse] = await Promise.all([
        fetchGitHubUser(),
        fetchGitHubRepos(),
        fetchGitHubEvents()
      ]);

      if (userResponse) {
        setProfile({
          name: userResponse.name || userResponse.login,
          username: userResponse.login,
          bio: userResponse.bio || "Full-stack developer passionate about creating beautiful, functional web applications.",
          location: userResponse.location || "Lagos, Nigeria",
          website: userResponse.blog || "https://github.com/" + userResponse.login,
          email: userResponse.email || "adeyemis710@gmail.com",
          avatar: userResponse.avatar_url,
          followers: userResponse.followers,
          following: userResponse.following,
          publicRepos: userResponse.public_repos,
          githubUrl: userResponse.html_url
        });
        
        if (userResponse.created_at) {
          setAccountCreatedAt(userResponse.created_at);
          const yearOptions = getAccountYearsSince(userResponse.created_at);
          setAvailableYears(yearOptions);
        }
      }

      if (reposResponse) {
        const formattedRepos = reposResponse.slice(0, 6).map(repo => ({
          id: repo.id,
          name: repo.name,
          description: repo.description || "No description available",
          language: repo.language || "Unknown",
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          url: repo.html_url,
          topics: repo.topics || [],
          updated_at: repo.updated_at
        }));
        setProjects(formattedRepos);
        
        const langStats = getLanguageStats(reposResponse);
        setLanguageStats(langStats);
      }

      if (eventsResponse) {
        setEvents(eventsResponse);
      }

      await loadContributions();
    } catch (error) {
      console.error('Error loading GitHub data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContributions = async () => {
    try {
      const { contributions: contributionsData, totalContributions: total } = await fetchGitHubContributions(contributionYears);
      setContributions(contributionsData);
      setTotalContributions(total);
      
      const stats = analyzeContributions(contributionsData);
      setContributionStats(stats);
    } catch (error) {
      console.error('Error loading contributions:', error);
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  if (!mounted) {
    return null;
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#58a6ff] mx-auto mb-4"></div>
          <p className="text-[#7d8590]">Loading GitHub data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {/* Profile Header */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 mb-6">
                <div className="text-center mb-4">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-[#30363d] hover:border-[#58a6ff] transition-colors"
                  />
                  <h1 className="text-2xl font-semibold text-[#f0f6fc] mb-1">{profile.name}</h1>
                  <p className="text-[#7d8590] text-lg">{profile.username}</p>
                </div>
                
                <p className="text-[#e6edf3] mb-4 text-sm leading-relaxed">{profile.bio}</p>
                
                <div className="space-y-2 text-sm">
                  {profile.location && (
                    <div className="flex items-center text-[#7d8590]">
                      <MapPin className="w-4 h-4 mr-2" />
                      {profile.location}
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center text-[#7d8590]">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline">
                        {profile.website.replace(/https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center text-[#7d8590]">
                      <Mail className="w-4 h-4 mr-2" />
                      <a href={`mailto:${profile.email}`} className="text-[#58a6ff] hover:underline">
                        {profile.email}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-4 mt-4 pt-4 border-t border-[#30363d]">
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[#7d8590] hover:text-[#58a6ff] transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="https://x.com/samueladeyemi" target="_blank" rel="noopener noreferrer" className="text-[#7d8590] hover:text-[#58a6ff] transition-colors">
                    <X className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com/in/samueladeyemi" target="_blank" rel="noopener noreferrer" className="text-[#7d8590] hover:text-[#58a6ff] transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-[#f0f6fc]">{profile.publicRepos}</div>
                    <div className="text-xs text-[#7d8590]">Repositories</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-[#f0f6fc]">{profile.followers}</div>
                    <div className="text-xs text-[#7d8590]">Followers</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-[#f0f6fc]">{profile.following}</div>
                    <div className="text-xs text-[#7d8590]">Following</div>
                  </div>
                </div>
              </div>

              {/* Experience Component - Updated */}
              <Experience 
                companies={companies}
                education={education}
                skills={skills}
                achievements={achievements}
              />
              
              {/* Education and Achievements - Mobile Only */}
              <div className="lg:hidden space-y-6">
                <Education education={education} />
                <Achievements achievements={achievements} />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Contributions Component - First */}
            <Contributions
              contributions={contributions}
              totalContributions={totalContributions}
              contributionYears={contributionYears}
              setContributionYears={setContributionYears}
              contributionStats={contributionStats}
              availableYears={availableYears}
              accountCreatedAt={accountCreatedAt}
            />

            {/* Projects Component - Second */}
            <Projects
              projects={projects}
              events={events}
              formatTimeAgo={formatTimeAgo}
              formatEventDescription={formatEventDescription}
              getEventColor={getEventColor}
            />
            <div className="hidden lg:block mt-5 space-y-6">
                <Education education={education} />
                <Achievements achievements={achievements} />
              </div>
            
            
          </div>
        </div>
      </div>
    </div>
  );
}
