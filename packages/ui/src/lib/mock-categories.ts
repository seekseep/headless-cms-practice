import type { Category } from './types';

export const categories: Category[] = [
  // ルートカテゴリ
  { id: 'cat-tech', parentId: null, name: 'テクノロジー', thumbnail: null, slug: 'technology', order: 0, description: '最新の技術トレンドや開発に関する記事' },
  { id: 'cat-life', parentId: null, name: 'ライフスタイル', thumbnail: null, slug: 'lifestyle', order: 1, description: '日常生活を豊かにする情報' },
  { id: 'cat-business', parentId: null, name: 'ビジネス', thumbnail: null, slug: 'business', order: 2, description: 'ビジネスやキャリアに関する記事' },
  { id: 'cat-health', parentId: null, name: '健康', thumbnail: null, slug: 'health', order: 3, description: '健康やウェルネスに関する情報' },
  { id: 'cat-education', parentId: null, name: '教育', thumbnail: null, slug: 'education', order: 4, description: '学びやスキルアップに関する記事' },
  { id: 'cat-entertainment', parentId: null, name: 'エンタメ', thumbnail: null, slug: 'entertainment', order: 5, description: '映画・音楽・ゲームなどの情報' },

  // テクノロジーの子カテゴリ
  { id: 'cat-frontend', parentId: 'cat-tech', name: 'フロントエンド', thumbnail: null, slug: 'frontend', order: 0, description: 'HTML, CSS, JavaScript, フレームワーク' },
  { id: 'cat-backend', parentId: 'cat-tech', name: 'バックエンド', thumbnail: null, slug: 'backend', order: 1, description: 'サーバーサイド開発' },
  { id: 'cat-infra', parentId: 'cat-tech', name: 'インフラ', thumbnail: null, slug: 'infrastructure', order: 2, description: 'クラウド・DevOps' },

  // ライフスタイルの子カテゴリ
  { id: 'cat-travel', parentId: 'cat-life', name: '旅行', thumbnail: null, slug: 'travel', order: 0, description: '旅行記や観光情報' },
  { id: 'cat-food', parentId: 'cat-life', name: 'グルメ', thumbnail: null, slug: 'food', order: 1, description: '料理やレストラン情報' },

  // ビジネスの子カテゴリ
  { id: 'cat-startup', parentId: 'cat-business', name: 'スタートアップ', thumbnail: null, slug: 'startup', order: 0, description: '起業やスタートアップに関する記事' },
  { id: 'cat-career', parentId: 'cat-business', name: 'キャリア', thumbnail: null, slug: 'career', order: 1, description: 'キャリア形成・転職' },

  // 教育の子カテゴリ
  { id: 'cat-programming', parentId: 'cat-education', name: 'プログラミング学習', thumbnail: null, slug: 'programming-learning', order: 0, description: 'プログラミング初心者向け' },
  { id: 'cat-language', parentId: 'cat-education', name: '語学', thumbnail: null, slug: 'language', order: 1, description: '外国語学習' },
];
