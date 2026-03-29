export type PostCategory = 'fragment' | 'beobachtung' | 'zitat' | 'notiz' | 'tagebuch';

export interface Post {
  id: string;
  title: string;
  category: PostCategory;
  content: string;
  date: string;
}

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  fragment: 'Fragment',
  beobachtung: 'Beobachtung',
  zitat: 'Zitat',
  notiz: 'Notiz',
  tagebuch: 'Tagebuch',
};
