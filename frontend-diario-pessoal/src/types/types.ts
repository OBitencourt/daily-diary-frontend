export type Mood = 'radiante' | 'feliz' | 'neutro' | 'triste' | 'pessimo';

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Entry {
  _id: string;
  user: string;
  date: string;
  text: string;
  mood: Mood;
  tags: string[];
  createdAt: string;
}

export interface Stats {
  mostFrequentMood: Mood | null;
  monthlyEntries: {
    _id: { month: number; year: number };
    count: number;
  }[];
}
