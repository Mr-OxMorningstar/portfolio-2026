export interface Link {
  label: string;
  href: string;
}

export interface Role {
  title: string;
  period: string;
}

export interface Job {
  company: string;
  meta: string;
  roles: Role[];
  highlights: string[];
}

export interface LedgerRow {
  account: string;
  work: string;
  amount: string;
  evidence: string;
  // True when the figure comes from billing data rather than a price estimate.
  measured: boolean;
}

export interface SideProject {
  name: string;
  summary: string;
  stack: string;
}

export interface SkillGroup {
  name: string;
  items: string;
}

export interface Badge {
  name: string;
  issued: string;
  image: string;
  url: string;
}

export interface Course {
  name: string;
  issuer: string;
  date: string;
}

export const profile = {
  name: 'Ntwanano A Hlungwane',
  location: 'Johannesburg, South Africa',
  email: 'hlungwane822@gmail.com',
  tagline: 'Full-stack engineer. React, TypeScript, Spring Boot, Node.js and AWS.',
  status: 'Available for full-stack engineering roles.',
  intro: [
    'I cut more than US$1,300 a month from AWS infrastructure across three client accounts. I also build the apps: React and TypeScript front ends, Spring Boot APIs, and the CI/CD pipelines that deploy them.',
    'At Skywalk Innovations I write features for client products and look after their cloud accounts. Where a number is an estimate rather than a measurement, the page says so.',
  ],
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ntwanano-a-hlungwane-89b84a251' },
    { label: 'GitHub', href: 'https://github.com/Mr-OxMorningstar' },
    { label: 'Credly', href: 'https://www.credly.com/users/agreement-hlungwane/badges' },
  ] satisfies Link[],
};

export const savings = {
  title: 'Cutting AWS bills by over US$1,300 a month',
  summary:
    'Between September and October 2026 I went through three AWS accounts my team looks after, one of ours and two clients’, and removed what they were paying for but not using.',
  method: [
    'I started from Cost Explorer, CloudWatch and CloudTrail, not from guesses. Before calling anything idle, I checked a second metric that should show activity, so an empty graph was never read as zero use.',
    'I did not take AWS’s own recommendations on trust. On one client account, two of them would have deleted services that real users were on, so I right-sized those instead.',
    'Changes went through OpenTofu and Terraform where the infrastructure was in code, with targeted plans, and I preferred reversible steps such as a snapshot before a delete. After changes I checked the services were still healthy, and where a full day of billing existed I confirmed the drop in Cost Explorer.',
    'When a change had a cost of its own I said so. Pausing one database meant the first request after a pause could time out, so I raised it and a fix was ticketed instead of quietly reverting.',
  ],
  ledger: [
    {
      account: 'Client account A',
      work: 'Moved three ECS Fargate workers to Lambda and removed an idle Aurora Serverless cluster. The monthly bill went from about US$691 to US$100–130.',
      amount: '561.00–591.00',
      evidence: 'Before from billing; after confirmed in AWS Cost Explorer (Oct 2026 forecast ~$153/mo total account)',
      measured: true,
    },
    {
      account: 'Company account',
      work: 'Removed seven unused VPC endpoints, turned on Aurora auto-pause, resized an EC2 server and retired an idle database.',
      amount: '311.50',
      evidence: 'Measured in Cost Explorer',
      measured: true,
    },
    {
      account: 'Company account',
      work: 'Found a DocumentDB cluster with no connections in 74 days and had it deleted.',
      amount: '76.35',
      evidence: 'Its billed daily cost',
      measured: true,
    },
    {
      account: 'Company account',
      work: 'Retired an unused ERP server, keeping a snapshot, and released an idle Elastic IP.',
      amount: '82.74',
      evidence: 'Priced from AWS rates',
      measured: false,
    },
    {
      account: 'Company account',
      work: 'Backed up and deleted four DynamoDB tables with zero reads and writes over 90 days.',
      amount: '7.76',
      evidence: 'Priced from DynamoDB table rates; CloudWatch confirmed 0 reads/writes over 90 days',
      measured: true,
    },
    {
      account: 'Client account B',
      work: 'Right-sized Fargate services and removed an orphaned EBS volume and an idle RDS database.',
      amount: '271.06',
      evidence: 'Confirmed in AWS Cost Explorer',
      measured: true,
    },
  ] satisfies LedgerRow[],
  // Interface text for the ledger controls; the totals themselves are worked out from the rows.
  controls: {
    group: 'Which savings to count',
    measured: 'Confirmed in billing data',
    all: 'All changes applied',
    hint: '"Billing data" counts only savings that showed as a confirmed drop in AWS Cost Explorer.',
    totalMeasured: 'Total, confirmed in billing data',
    totalAll: 'Total, all changes applied',
    notCounted: 'Not counted',
    bars: 'Bars show the low end of each monthly amount.',
  },
};

export const booking = {
  title: 'BringDvibes, a booking app for a DJ business',
  period: 'September 2026 · not live yet',
  summary:
    'Clients pick services, see a price and book online. The owner gets the booking straight away and runs bookings, prices and business details from a dashboard.',
  points: [
    'Prices are worked out again in Postgres when a booking is made, so a price edited in the browser is ignored. I tested exactly that.',
    'Every table has row-level security. Visitors can only book through one database function that checks the request; they never write to a table.',
    'The owner’s dashboard updates live over Supabase Realtime, with status, private notes, one-tap call, WhatsApp or email, and an editor for services and prices.',
    'Built as small pull requests stacked on each other, with every schema change as a versioned migration. Hosting is set up for AWS Amplify.',
  ],
  stack: 'React, TypeScript, Vite, Supabase (Postgres, row-level security, Realtime, Auth), AWS Amplify',
};

export const office = {
  title: 'The Office, a 3D view of my AI coding agents',
  summary:
    'I work with AI coding agents, and I wanted to see them. The Office is a walkable 3D office in Three.js: each agent session appears as a person at a desk in its team’s room, and the team boards show who is working on what.',
  points: [
    'Live: a small server receives events from the agent sessions and streams them to the page, so people arrive, sit, work and leave as sessions start and stop.',
    'When an agent needs permission for something, it raises a hand, and I can approve or deny it from inside the office.',
    'First-person and overview cameras, collision, and touch controls for phones.',
    'Rooms are drawn with plain Three.js geometry and canvas textures, no 3D models.',
  ],
  stack: 'Three.js, JavaScript, Vite, server-sent events',
  captionHint: 'Click a room, or use the buttons, to fly to it.',
  caption: 'Three of The Office’s team rooms, built with its own room code. Drag to look around. Desk and board states here are sample data.',
};

export const jobs: Job[] = [
  {
    company: 'Skywalk Innovations',
    meta: 'Remote · Contract',
    roles: [
      { title: 'Junior Full-stack Developer', period: 'Jan 2026 – present' },
      { title: 'Junior Software Engineer', period: 'Dec 2024 – Jun 2026' },
    ],
    highlights: [
      'Cut more than US$1,300 a month across three AWS accounts, one company and two client, including an ECS-to-Lambda move that lowered one client’s bill by about 82%.',
      'Built Stripe and Paystack payment flows on Supabase Edge Functions for a multi-tenant React/TypeScript SaaS product, covered by Playwright end-to-end tests.',
      'Delivered features on a Spring Boot and MySQL API, including Liquibase migrations and JUnit tests.',
      'Migrated a production MongoDB database between AWS accounts and supported services on Elastic Beanstalk, Lambda and API Gateway.',
      'Set up and maintained Azure DevOps CI/CD pipelines for Bitbucket repositories, deploying Maven builds to Elastic Beanstalk.',
      'Maintained a React Native app and added test-coverage reporting (JaCoCo for the Java API, Jest for the app).',
    ],
  },
  {
    company: 'Aions Creative Technology',
    meta: 'Roodepoort · Full-time',
    roles: [{ title: 'Full-stack Developer', period: 'Jan 2023 – Dec 2024' }],
    highlights: [
      'Built responsive web applications for desktop and mobile with React, Node.js, Express and MongoDB.',
      'Designed database schemas and backend APIs in Node.js and Python, integrating third-party services.',
      'Refactored legacy code to current standards and fixed defects found in field testing.',
      'Wrote Python scripts that automated spreadsheet and admin work, and drafted technical proposals for prospective clients.',
    ],
  },
];

export const sideProjects: SideProject[] = [
  {
    name: 'CV parser',
    summary: 'Built for a client recruitment app. Takes an uploaded CV and returns structured JSON for downstream automation.',
    stack: 'AWS Bedrock, Python',
  },
  {
    name: 'Job-application workflow',
    summary: 'Takes a CV and a job description, then drafts and sends a tailored email to the employer.',
    stack: 'n8n',
  },
  {
    name: 'Agent_HQ',
    summary:
      'Persistent long-term memory for AI coding sessions — seven memory types (episodic, semantic, procedural and more) across 400+ documents and 20+ project folders in Google Drive, with a salience-scored index and integrity checks. Every session reads from it and writes back to it. Running and actively evolving since early 2026.',
    stack: 'Google Drive, Markdown',
  },
];

export const skills: SkillGroup[] = [
  { name: 'Languages', items: 'TypeScript, JavaScript, Java, Python, SQL' },
  { name: 'Front end', items: 'React, React Native, Tailwind CSS, Three.js, HTML, CSS' },
  { name: 'Back end', items: 'Spring Boot, Node.js, Express, Supabase, REST APIs' },
  { name: 'Data', items: 'PostgreSQL, MySQL, MongoDB, Liquibase' },
  {
    name: 'Cloud and DevOps',
    items: 'AWS (EC2, VPC, RDS/Aurora, Lambda, ECS, API Gateway, Elastic Beanstalk, S3, Bedrock, Cost Explorer), OpenTofu/Terraform, Azure DevOps, Docker',
  },
  { name: 'Testing', items: 'JUnit, Playwright, Jest, JaCoCo' },
  { name: 'Payments and automation', items: 'Stripe, Paystack, n8n' },
];

const credlyBadge = (id: string) => `https://www.credly.com/badges/${id}/public_url`;

export const badges: Badge[] = [
  { name: 'Agentic AI Essentials', issued: 'Jun 2026', image: '/badges/agentic-ai.png', url: credlyBadge('b327ddfa-6e9c-4771-945d-82c058a4d927') },
  { name: 'Generative AI Essentials', issued: 'Jun 2026', image: '/badges/generative-ai.png', url: credlyBadge('e8f3ecd7-cee2-4296-aee4-c0b126f92f46') },
  { name: 'Cloud Economics Essentials', issued: 'Jul 2025', image: '/badges/cloud-economics.png', url: credlyBadge('d38ff675-9606-4a94-a509-d4f802f31416') },
  { name: 'Technical Accredited', issued: 'Jul 2025', image: '/badges/technical.png', url: credlyBadge('869c3f23-16b8-4e98-a82c-b1b4fb657f88') },
  { name: 'Sales Accredited', issued: 'Jul 2025', image: '/badges/sales.png', url: credlyBadge('23918370-5b80-42f1-89fb-41592c12be33') },
];

export const courses: Course[] = [
  { name: 'Responsive Web Design', issuer: 'freeCodeCamp', date: 'Oct 2024' },
  { name: 'JavaScript Algorithms and Data Structures', issuer: 'freeCodeCamp', date: 'Feb 2023' },
  { name: 'Introduction to Probability and Data with R', issuer: 'Duke University, Coursera', date: 'Sep 2022' },
  { name: 'Big Data Emerging Technologies', issuer: 'Yonsei University, Coursera', date: 'Sep 2022' },
  { name: 'Introduction to Artificial Intelligence', issuer: 'Coursera', date: 'Sep 2022' },
];

export const education = {
  name: 'Diploma in Information Technology',
  school: 'Vaal University of Technology',
  period: '2020 – 2022',
};

export const advice = {
  heading: 'Leave me one piece of random advice',
  prompt: 'You have scrolled all the way down here, so you get a say. Tell me one thing I should know: about code, work, or anything at all. Make it random.',
  label: 'Your advice',
  placeholder: 'Write it here, in a sentence or two',
  submit: 'Share it',
  privacy: 'This stays in your browser. Nothing is sent or stored.',
  thanks: 'Thank you. This is what you told me:',
  again: 'Give another',
  empty: 'Please write something first.',
};

export const nav = {
  label: 'Sections',
  intro: 'Jump to a section — each uses a colour from the 3D office below.',
  room: 'room',
};
