export interface Track {
    id: number;
    title: string;
    user: {
      username: string;
    };
    duration: number;
    license: string;
  }
  
  export interface StreamResponse {
    url: string;
  }