import type { CSSProperties } from 'react';

// The role-room colours from The Office (ROLE_ROOMS in three/office/world/hq/team-room.js, plus Docs & PM).
// `color` is for fills, bars and markers. `deep` is a darker shade of the same hue that passes WCAG AA as text on the paper background.
export interface Room {
  name: string;
  color: string;
  deep: string;
}

export const rooms = {
  frontend: { name: 'Frontend', color: '#e0409b', deep: '#f472b6' },
  backend: { name: 'Backend', color: '#2f6feb', deep: '#60a5fa' },
  qa: { name: 'QA', color: '#22b86a', deep: '#34d399' },
  review: { name: 'Code Review', color: '#7c4dff', deep: '#a78bfa' },
  security: { name: 'Security', color: '#e5383b', deep: '#f87171' },
  devops: { name: 'DevOps', color: '#f28c1c', deep: '#fbbf24' },
  techlead: { name: 'Tech Lead', color: '#f2c21b', deep: '#fde68a' },
  docs: { name: 'Docs', color: '#14b8b0', deep: '#2dd4bf' },
} satisfies Record<string, Room>;

export type RoomId = keyof typeof rooms;

// Sets the room colours as CSS variables for everything inside the element.
export const roomVars = (id: RoomId): CSSProperties =>
  ({ '--room': rooms[id].color, '--room-deep': rooms[id].deep }) as CSSProperties;

// The rooms shown in The Office view, in left to right order.
export const TOUR_ROOMS = ['frontend', 'backend', 'qa'] as const satisfies readonly RoomId[];
