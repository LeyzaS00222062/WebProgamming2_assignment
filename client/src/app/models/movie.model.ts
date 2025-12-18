export interface Movie {
  _id: string;
  title: string;
  director: string;
  year: number;
  genre: string[];
  description: string;
  posterUrl?: string;
  createdAt: Date;
}