import type { Article } from './types';

function d(daysAgo: number): Date {
  const date = new Date('2026-02-10T00:00:00');
  date.setDate(date.getDate() - daysAgo);
  return date;
}

export const articles: Article[] = [
  { id: 'a01', title: 'Astro 5 で始める静的サイト構築', slug: 'getting-started-with-astro-5', content: 'Astro 5 はコンテンツ駆動型のWebサイトを構築するための最新フレームワークです。本記事では、Astro 5 の基本的なセットアップから、ページの作成、コンポーネントの活用まで、ステップバイステップで解説します。', categoryId: 'cat-frontend', createdAt: d(0), updatedAt: d(0) },
  { id: 'a02', title: 'React Server Components の実践ガイド', slug: 'react-server-components-guide', content: 'React Server Components (RSC) はサーバーサイドでレンダリングされるコンポーネントです。クライアントに送信するJavaScriptの量を削減し、パフォーマンスを大幅に向上させます。', categoryId: 'cat-frontend', createdAt: d(1), updatedAt: d(1) },
  { id: 'a03', title: 'TypeScript 5.5 の新機能まとめ', slug: 'typescript-5-5-new-features', content: 'TypeScript 5.5 では型推論の改善やパフォーマンスの向上など、多くの新機能が追加されました。本記事では主要な変更点を紹介します。', categoryId: 'cat-frontend', createdAt: d(3), updatedAt: d(3) },
  { id: 'a04', title: 'Tailwind CSS v4 移行ガイド', slug: 'tailwind-css-v4-migration', content: 'Tailwind CSS v4 では設定ファイルが不要になり、CSSベースの設定に移行しました。既存プロジェクトからの移行手順を解説します。', categoryId: 'cat-frontend', createdAt: d(5), updatedAt: d(5) },
  { id: 'a05', title: 'Node.js のストリーム処理を理解する', slug: 'understanding-nodejs-streams', content: 'Node.js のストリームは大量のデータを効率的に処理するための仕組みです。Readable、Writable、Transform の各ストリームの使い方を実例とともに解説します。', categoryId: 'cat-backend', createdAt: d(2), updatedAt: d(2) },
  { id: 'a06', title: 'Hono フレームワーク入門', slug: 'introduction-to-hono', content: 'Hono は軽量で高速なWebフレームワークです。Cloudflare Workers や AWS Lambda など、様々なランタイムで動作します。基本的な使い方からミドルウェアの活用まで紹介します。', categoryId: 'cat-backend', createdAt: d(4), updatedAt: d(4) },
  { id: 'a07', title: 'GraphQL vs REST API の選び方', slug: 'graphql-vs-rest-api', content: 'API設計においてGraphQLとREST APIのどちらを選ぶべきか。それぞれのメリット・デメリットをユースケース別に比較します。', categoryId: 'cat-backend', createdAt: d(7), updatedAt: d(7) },
  { id: 'a08', title: 'データベース設計のベストプラクティス', slug: 'database-design-best-practices', content: '正規化、インデックス設計、パーティショニングなど、データベース設計で押さえておくべきポイントを実践的に解説します。', categoryId: 'cat-backend', createdAt: d(10), updatedAt: d(10) },
  { id: 'a09', title: 'AWS CDK でインフラをコード管理する', slug: 'aws-cdk-infrastructure-as-code', content: 'AWS CDK を使ってインフラをTypeScriptで定義・管理する方法を紹介します。CloudFormation テンプレートを直接書くよりも効率的にインフラを構築できます。', categoryId: 'cat-infra', createdAt: d(6), updatedAt: d(6) },
  { id: 'a10', title: 'Docker コンテナのセキュリティ対策', slug: 'docker-container-security', content: 'Docker コンテナを本番環境で安全に運用するためのセキュリティ対策を紹介します。イメージスキャン、最小権限、ネットワーク分離などの手法を解説します。', categoryId: 'cat-infra', createdAt: d(8), updatedAt: d(8) },
  { id: 'a11', title: 'Kubernetes 入門：基本概念と実践', slug: 'kubernetes-introduction', content: 'Kubernetes の基本概念（Pod、Service、Deployment）を理解し、実際にアプリケーションをデプロイする手順を解説します。', categoryId: 'cat-infra', createdAt: d(12), updatedAt: d(12) },
  { id: 'a12', title: '週末におすすめの国内旅行先5選', slug: 'weekend-domestic-travel-spots', content: '週末の1泊2日で楽しめる国内旅行先を厳選して紹介します。温泉、自然、グルメなど、リフレッシュに最適なスポットです。', categoryId: 'cat-travel', createdAt: d(9), updatedAt: d(9) },
  { id: 'a13', title: 'バックパッカーのための東南アジアガイド', slug: 'southeast-asia-backpacker-guide', content: '東南アジアをバックパッカーとして旅するためのガイド。予算、移動手段、おすすめルートなどを紹介します。', categoryId: 'cat-travel', createdAt: d(15), updatedAt: d(15) },
  { id: 'a14', title: '自宅で作れる本格パスタレシピ', slug: 'homemade-pasta-recipes', content: '自宅で簡単に作れる本格イタリアンパスタのレシピを5つ紹介します。基本のペペロンチーノからカルボナーラまで。', categoryId: 'cat-food', createdAt: d(11), updatedAt: d(11) },
  { id: 'a15', title: 'コーヒーの淹れ方完全ガイド', slug: 'coffee-brewing-guide', content: 'ドリップ、フレンチプレス、エスプレッソなど、様々なコーヒーの淹れ方を比較。豆の選び方から抽出のコツまで解説します。', categoryId: 'cat-food', createdAt: d(14), updatedAt: d(14) },
  { id: 'a16', title: 'スタートアップの資金調達戦略', slug: 'startup-fundraising-strategy', content: 'シード期からシリーズAまでのスタートアップの資金調達戦略を解説します。VCとの交渉やピッチデッキの作成方法も紹介。', categoryId: 'cat-startup', createdAt: d(13), updatedAt: d(13) },
  { id: 'a17', title: 'リモートワーク時代のチームマネジメント', slug: 'remote-work-team-management', content: 'リモートワーク環境でチームの生産性を維持し、コミュニケーションを活性化するための具体的な方法を紹介します。', categoryId: 'cat-startup', createdAt: d(16), updatedAt: d(16) },
  { id: 'a18', title: 'エンジニアのキャリアパス：IC vs マネージャー', slug: 'engineer-career-path-ic-vs-manager', content: 'エンジニアとしてのキャリアをICとして深めるか、マネージャーに転向するか。それぞれの道のメリット・デメリットを経験者の視点から解説します。', categoryId: 'cat-career', createdAt: d(17), updatedAt: d(17) },
  { id: 'a19', title: '転職面接で聞かれる技術質問TOP10', slug: 'tech-interview-top-10-questions', content: '技術面接でよく聞かれる質問とその回答例を紹介。アルゴリズム、システム設計、行動面接の対策を網羅します。', categoryId: 'cat-career', createdAt: d(20), updatedAt: d(20) },
  { id: 'a20', title: '毎日続けられる運動習慣の作り方', slug: 'building-daily-exercise-habit', content: '忙しい日常でも続けられる運動習慣の作り方を紹介。小さな習慣から始めて、徐々に運動量を増やすアプローチを解説します。', categoryId: 'cat-health', createdAt: d(18), updatedAt: d(18) },
  { id: 'a21', title: '睡眠の質を向上させる7つの方法', slug: 'improve-sleep-quality', content: '質の良い睡眠を取るための具体的な方法を紹介。睡眠環境の改善からルーティンの見直しまで、科学的根拠に基づいたアドバイスです。', categoryId: 'cat-health', createdAt: d(22), updatedAt: d(22) },
  { id: 'a22', title: 'デスクワーカーのための腰痛対策', slug: 'back-pain-prevention-desk-workers', content: '長時間のデスクワークによる腰痛を予防・改善するためのストレッチや姿勢改善のコツを紹介します。', categoryId: 'cat-health', createdAt: d(25), updatedAt: d(25) },
  { id: 'a23', title: 'Python で始めるプログラミング入門', slug: 'python-programming-introduction', content: 'プログラミング未経験者向けに Python の基礎を解説します。変数、条件分岐、ループ、関数の基本を学びましょう。', categoryId: 'cat-programming', createdAt: d(19), updatedAt: d(19) },
  { id: 'a24', title: 'Git の基本操作をマスターしよう', slug: 'mastering-git-basics', content: 'Git の基本操作（init, add, commit, push, pull, branch, merge）を実例とともに解説。チーム開発に必要な知識を身につけましょう。', categoryId: 'cat-programming', createdAt: d(21), updatedAt: d(21) },
  { id: 'a25', title: 'アルゴリズムとデータ構造の基礎', slug: 'algorithms-data-structures-basics', content: '配列、リスト、スタック、キュー、ツリーなどの基本的なデータ構造と、ソートや探索のアルゴリズムを解説します。', categoryId: 'cat-programming', createdAt: d(24), updatedAt: d(24) },
  { id: 'a26', title: '英語学習に効果的なシャドーイング', slug: 'effective-shadowing-english', content: 'シャドーイングを活用した英語学習法を紹介。リスニング力とスピーキング力を同時に向上させる効果的な練習方法です。', categoryId: 'cat-language', createdAt: d(23), updatedAt: d(23) },
  { id: 'a27', title: '多言語学習のコツとおすすめアプリ', slug: 'multilingual-learning-tips', content: '複数の言語を効率的に学ぶためのコツと、おすすめの語学学習アプリを紹介します。', categoryId: 'cat-language', createdAt: d(28), updatedAt: d(28) },
  { id: 'a28', title: '2026年注目の映画ランキング', slug: '2026-must-watch-movies', content: '2026年に公開される注目映画をランキング形式で紹介。アクション、SF、ドラマなど様々なジャンルから厳選しました。', categoryId: 'cat-entertainment', createdAt: d(26), updatedAt: d(26) },
  { id: 'a29', title: 'インディーゲームのおすすめ10選', slug: 'indie-games-top-10', content: '大手タイトルに負けない面白さを持つインディーゲームを厳選。ジャンル別におすすめの10作品を紹介します。', categoryId: 'cat-entertainment', createdAt: d(27), updatedAt: d(27) },
  { id: 'a30', title: 'ポッドキャストで学ぶテック業界', slug: 'tech-podcasts-recommendations', content: 'テクノロジー業界の最新情報をキャッチアップできるおすすめポッドキャストを紹介。通勤時間を学びの時間に変えましょう。', categoryId: 'cat-entertainment', createdAt: d(30), updatedAt: d(30) },
  { id: 'a31', title: 'CSS Grid レイアウト完全ガイド', slug: 'css-grid-layout-complete-guide', content: 'CSS Grid を使った柔軟なレイアウト作成方法を解説。基本的なグリッド定義から、複雑なレスポンシブレイアウトまで実例付きで紹介します。', categoryId: 'cat-frontend', createdAt: d(29), updatedAt: d(29) },
  { id: 'a32', title: 'CI/CD パイプラインの構築ガイド', slug: 'cicd-pipeline-guide', content: 'GitHub Actions を使った CI/CD パイプラインの構築方法を解説。テスト自動化からデプロイまでの一連のワークフローを紹介します。', categoryId: 'cat-infra', createdAt: d(31), updatedAt: d(31) },
  { id: 'a33', title: 'マイクロサービスアーキテクチャ入門', slug: 'microservices-architecture-intro', content: 'マイクロサービスアーキテクチャの基本概念、メリット・デメリット、そしてモノリスからの移行戦略について解説します。', categoryId: 'cat-backend', createdAt: d(32), updatedAt: d(32) },
  { id: 'a34', title: '健康的な食事の基本ルール', slug: 'healthy-eating-basics', content: '栄養バランスの取れた食事の基本ルールを紹介。忙しい人でも実践できるシンプルな食事管理法を解説します。', categoryId: 'cat-health', createdAt: d(33), updatedAt: d(33) },
  { id: 'a35', title: 'Web アクセシビリティの基礎知識', slug: 'web-accessibility-basics', content: 'すべてのユーザーが利用しやすいWebサイトを作るためのアクセシビリティの基礎知識。WCAG ガイドラインに基づいた実践方法を紹介します。', categoryId: 'cat-frontend', createdAt: d(34), updatedAt: d(34) },
];
