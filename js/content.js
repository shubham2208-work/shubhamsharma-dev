/** Edit this file to update your info, links, and projects */

/** Set to true and unhide #resume in index.html to show the resume section again */
export const showResume = false;

export const profile = {
  firstName: 'SHUBHAM',
  greeting: 'HI THERE!',
  titleLine: "I'M",
  role: 'DEVELOPER / BUILDER',
  tagline:
    "I'm Shubham — I've started building some cool web apps and tools that solve real problems. I'm early in the journey, learning fast, and shipping what I make. This portfolio is home for everything I build: live demos, GitHub, and what's next.",
  email: 'shubham2208.work@gmail.com',
  location: 'India',
  github: 'https://github.com/shubham2208-work',
  githubHandle: 'shubham2208-work',
  rcmCalculator: 'https://shubham2208-work.github.io/rcm-calculator/',
  bazaarRadar: 'https://trend-finder-india.vercel.app/',
  resumeUrl: '#resume',
};

export const services = [
  {
    id: 'web',
    title: 'Web Development',
    description:
      'Responsive sites and SPAs with modern stacks — fast, accessible, and deploy-ready.',
  },
  {
    id: 'mobile',
    title: 'Mobile Apps',
    description:
      'Cross-platform apps with React Native / Expo — from prototype to store-ready builds.',
  },
  {
    id: 'tools',
    title: 'Tools & Automation',
    description:
      'Internal tools, workflows, and integrations that save time and reduce friction.',
  },
];

export const education = [
  {
    period: '2018 — 2022',
    title: 'Bachelor of Technology',
    place: 'Your University',
    detail: 'Computer Science or related field — fundamentals, algorithms, and software engineering.',
  },
];

export const experience = [
  {
    period: '2023 — Present',
    title: 'Software Developer',
    place: 'Company / Freelance',
    detail:
      'Building full-stack features, mobile apps, and shipping products end-to-end.',
  },
  {
    period: '2022 — 2023',
    title: 'Junior Developer',
    place: 'Previous Role',
    detail: 'Collaborated on web projects, learned production practices and code review.',
  },
];

export const projects = [
  {
    id: 'bazaar-radar',
    title: 'Bazaar Radar',
    category: 'web',
    categories: ['web', 'all'],
    description:
      'Research app for Indian marketplace sellers — relative search interest by region, Amazon India & Flipkart listing snapshots, and estimated margins with honest data labels.',
    image: null,
    links: [
      { label: 'Open app', url: profile.bazaarRadar, primary: true },
      {
        label: 'GitHub',
        url: 'https://github.com/shubham2208-work/trend-finder-india',
      },
    ],
    accent: '#0a1628',
  },
  {
    id: 'rcm-calculator',
    title: 'RCM Calculator',
    category: 'web',
    categories: ['web', 'tools', 'all'],
    description: 'Revenue cycle / billing calculator tool — live on the web.',
    image: null,
    links: [{ label: 'Open app', url: profile.rcmCalculator, primary: true }],
    accent: '#163832',
  },
];

export const portfolioFilters = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web apps' },
  { id: 'tools', label: 'Tools' },
];
