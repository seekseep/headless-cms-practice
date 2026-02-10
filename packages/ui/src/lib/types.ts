export type Article = {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  content?: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  id: string;
  parentId: string | null;
  name: string;
  thumbnail: string | null;
  slug: string;
  order: number;
  description?: string;
};

// API レスポンス型
export type ListResponse<T> = {
  data: {
    items: T[];
    nextToken: string | null;
  };
};

export type SingleResponse<T> = {
  data: T;
};
