
export interface Track {
  id: number;
  title: string;
  artists: { name: string }[];
}

export interface Playlist {
  id: number;
  title: string;
  trackCount: number;
}