export type PostCategory = 'fragment' | 'beobachtung' | 'zitat' | 'polis';

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
  polis: 'Polis',
};
