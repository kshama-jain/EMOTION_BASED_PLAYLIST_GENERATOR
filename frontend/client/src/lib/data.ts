import { Playlist, CalendarEvent } from "./types";

export const PLAYLISTS: Playlist[] = [
  {
    id: "1",
    title: "Chill Vibes",
    description: "Relaxing tunes for your downtime",
    coverUrl: "https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_960_720.jpg",
    songCount: 32,
    duration: "2h 15min",
    createdAt: "2025-03-20",
    color: "green"
  },
  {
    id: "2",
    title: "Motivation Mix",
    description: "Get pumped up and ready to tackle anything",
    coverUrl: "https://cdn.pixabay.com/photo/2015/01/07/15/51/woman-591576_960_720.jpg",
    songCount: 28,
    duration: "1h 50min",
    createdAt: "2025-03-18",
    color: "purple"
  },
  {
    id: "3",
    title: "Feeling Blue",
    description: "Emotional songs for contemplative moments",
    coverUrl: "https://cdn.pixabay.com/photo/2017/12/17/14/12/wave-3024343_960_720.jpg",
    songCount: 24,
    duration: "1h 45min",
    createdAt: "2025-03-15",
    color: "blue"
  },
  {
    id: "4",
    title: "Happy Hits",
    description: "Upbeat tracks to brighten your day",
    coverUrl: "https://cdn.pixabay.com/photo/2016/11/23/15/32/pedestrians-1853552_960_720.jpg",
    songCount: 35,
    duration: "2h 10min",
    createdAt: "2025-03-10",
    color: "yellow"
  },
];

export const TRENDING_PLAYLISTS: Playlist[] = [
  {
    id: "5",
    title: "Chill Out",
    description: "Ambient tracks for deep relaxation",
    coverUrl: "https://cdn.pixabay.com/photo/2020/09/19/19/37/landscape-5585247_960_720.jpg",
    songCount: 42,
    duration: "3h 5min",
    createdAt: "2025-03-01",
  },
  {
    id: "6",
    title: "Hip Hop Mix",
    description: "Latest and greatest hip hop tracks",
    coverUrl: "https://cdn.pixabay.com/photo/2015/05/15/14/21/concert-768722_960_720.jpg",
    songCount: 26,
    duration: "1h 30min",
    createdAt: "2025-03-05",
  },
  {
    id: "7",
    title: "Daily Mix 1",
    description: "Personalized mix of favorites and new discoveries",
    coverUrl: "https://cdn.pixabay.com/photo/2015/02/02/11/09/office-620822_960_720.jpg",
    songCount: 30,
    duration: "2h",
    createdAt: "2025-03-08",
  },
  {
    id: "8",
    title: "Today's Top Hits",
    description: "The most popular songs right now",
    coverUrl: "https://cdn.pixabay.com/photo/2017/08/03/21/48/drinks-2578446_960_720.jpg",
    songCount: 50,
    duration: "3h 20min",
    createdAt: "2025-03-22",
  },
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "event1",
    title: "Created \"Happy Vibes\" Playlist",
    type: "create-playlist",
    date: "2025-03-20",
    color: "green"
  },
  {
    id: "event2",
    title: "Created \"Study Focus\" Playlist",
    type: "create-playlist",
    date: "2025-03-22",
    color: "purple"
  },
  {
    id: "event3",
    title: "Created \"Chill Evening\" Playlist",
    type: "create-playlist",
    date: "2025-03-23",
    color: "blue"
  }
];
