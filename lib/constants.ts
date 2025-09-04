import { Company, IEducation, IAchievement } from './types';
import { generateGitHubAchievements } from './github';

export const skills = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python",
  "PostgreSQL", "MongoDB", "AWS", "Docker", "Git", "Tailwind CSS"
];

export const companies: Company[] = [
  {
    name: "Passpadi",
    role: "Senior Full Stack Developer",
    period: "May 2025 - Present",
    logo: "https://www.passpadi.com/logo.svg",
    description: "Leading development of EdTech and AI-powered educational solutions, creating innovative learning platforms.",
    technologies: ["React", "Node.js", "AI/ML", "TypeScript", "Python"],
    website: "https://passpadi.com"
  },
  {
    name: "Qataloog",
    role: "Full Stack Developer",
    period: "Dec 2024 - May 2025",
    logo: "https://www.qataloog.com/favicon/favicon-qataloog.svg",
    description: "Developed B2B EdTech solutions and Learning Management Systems for educational institutions.",
    technologies: ["React.js", "JavaScript", "LMS", "B2B Solutions"],
    website: "https://qataloog.com"
  },
  {
    name: "Payzita",
    role: "Frontend Developer",
    period: "Jan 2023 - Jun 2024",
    logo: "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1",
    description: "Built fintech payment solutions and digital wallet applications with focus on user experience.",
    technologies: ["React", "JavaScript", "Fintech", "Payment Systems"],
    website: "https://payzita.com"
  },
  {
    name: "Smartteller.net",
    role: "Frontend Developer",
    period: "Feb 2021 - Jul 2022",
    logo: "https://smartteller.net/assets/img/icon.png",
    description: "Built digital banking solutions and fintech applications, focusing on user experience and security.",
    technologies: ["React", "JavaScript", "Fintech", "Digital Banking"],
    website: "https://smartteller.net"
  }
];

export const education: IEducation[] = [
  {
    institution: "University of Lagos (UNILAG)",
    degree: "Bachelor of Science in Computer Science",
    period: "2018 - 2022",
    logo: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1",
    description: "Comprehensive study of computer science fundamentals including algorithms, data structures, software engineering, and system design.",
    subjects: ["Data Structures", "Algorithms", "Software Engineering", "Database Systems"],
    website: "https://unilag.edu.ng"
  },
  {
    institution: "ALX",
    degree: "Software Engineering Course",
    period: "2023 - 2024",
    logo: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1",
    description: "Intensive software engineering program focusing on full-stack development, system design, and industry best practices.",
    subjects: ["Full-Stack Development", "System Design", "DevOps", "Project Management"],
    website: "https://alxafrica.com"
  }
];

// Dynamic GitHub-based achievements (will be fetched at runtime)
export const getAchievements = async (): Promise<IAchievement[]> => {
  try {
    const githubAchievements = await generateGitHubAchievements();
    
    // Combine with any static achievements if needed
    const staticAchievements: IAchievement[] = [
      {
        title: "Portfolio Launch",
        description: "Successfully launched personal portfolio website with modern tech stack",
        date: "2024-01-15",
        issuer: "Self",
        category: "project",
        icon: "Rocket"
      }
    ];
    
    return [...(githubAchievements as IAchievement[]), ...staticAchievements];
  } catch (error) {
    console.error('Error fetching achievements:', error);
    // Return static fallback achievements
    return [
      {
        title: "Portfolio Launch",
        description: "Successfully launched personal portfolio website",
        date: "2024-01-15",
        category: "project",
        issuer: "Self",
        icon: "Rocket"
      }
    ];
  }
};

// Static achievements export for backward compatibility
export const achievements: IAchievement[] = [
  {
    title: "ALX Software Engineering Certificate",
    description: "Completed intensive 12-month software engineering program covering full-stack development, system design, and industry best practices.",
    date: "2024",
    category: "certification",
    issuer: "ALX Africa",
    credentialUrl: "https://alxafrica.com",
    icon: "🎓"
  },
  {
    title: "AWS Cloud Practitioner",
    description: "Demonstrated foundational knowledge of AWS Cloud services and best practices for cloud architecture.",
    date: "2023",
    category: "certification",
    issuer: "Amazon Web Services",
    credentialUrl: "https://aws.amazon.com/certification/",
    icon: "☁️"
  },
  {
    title: "Top Performer - Passpadi",
    description: "Recognized for exceptional performance in developing AI-powered educational solutions and leading technical initiatives.",
    date: "2025",
    category: "recognition",
    issuer: "Passpadi",
    icon: "🏆"
  },
  {
    title: "Open Source Contributor",
    description: "Active contributor to various open-source projects with focus on React, TypeScript, and developer tools.",
    date: "2023-Present",
    category: "project",
    issuer: "GitHub Community",
    credentialUrl: "https://github.com/samueladeyemi",
    icon: "🚀"
  },
  {
    title: "Fintech Innovation Award",
    description: "Led development of innovative payment solutions at Payzita, improving user experience and transaction security.",
    date: "2024",
    category: "award",
    issuer: "Payzita",
    icon: "💳"
  },
  {
    title: "React Developer Certification",
    description: "Advanced certification in React development, covering hooks, context, performance optimization, and modern patterns.",
    date: "2023",
    category: "certification",
    issuer: "Meta",
    credentialUrl: "https://developers.facebook.com/docs/react/",
    icon: "⚛️"
  }
];