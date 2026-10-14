import { rooms } from '../data/rooms';

// A row of the eight room colours.
export default function RoomStrip({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`flex h-1.5 max-w-full ${className}`}>
      {Object.values(rooms).map((room) => (
        <span key={room.name} className="flex-1" style={{ background: room.color }} />
      ))}
    </div>
  );
}
