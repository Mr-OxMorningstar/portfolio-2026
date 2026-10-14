import type { RoomId } from './rooms';

// The page's sections, each in the colour of one of The Office's rooms.
export const sections = {
  work: { id: 'work', title: 'Selected work', room: 'devops' },
  experience: { id: 'experience', title: 'Experience', room: 'backend' },
  other: { id: 'other', title: 'Other projects', room: 'review' },
  skills: { id: 'skills', title: 'Skills', room: 'qa' },
  credentials: { id: 'credentials', title: 'Credentials and education', room: 'docs' },
  advice: { id: 'advice', title: 'Random advice', room: 'frontend' },
} satisfies Record<string, { id: string; title: string; room: RoomId }>;
