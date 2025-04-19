export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  songCount: number;
  duration: string;
  createdAt: string;
  color?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'create-playlist' | 'listen-playlist' | 'discover-music';
  date: string;
  time?: string;
  description?: string;
  color?: string;
}

export type CalendarViewType = 'fullCalendar' | 'simple' | 'playlists';
export type CalendarDisplayType = 'month' | 'week' | 'day';
