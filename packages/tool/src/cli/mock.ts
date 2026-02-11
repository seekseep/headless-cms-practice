import { makeCreateCategoryCommand, makeCreatePostCommand } from "@headless-cms-practice/aws-service";
import { fromIni } from "@aws-sdk/credential-providers";

interface MockOptions {
  profile: string;
  region?: string;
}

export async function mock(_options: MockOptions): Promise<void> {
  const credentials = fromIni({ profile: process.env.AWS_PROFILE! });

  const categoriesTableConfig = {
    tableName: process.env.CATEGORIES_TABLE_NAME!,
    credentials,
  };
  const postsTableConfig = {
    tableName: process.env.POSTS_TABLE_NAME!,
    credentials,
  };

  const createCategory = makeCreateCategoryCommand(categoriesTableConfig);
  const createPost = makeCreatePostCommand(postsTableConfig);

  // --- Categories ---
  console.log("Creating categories...");

  const techResult = await createCategory({
    name: "テクノロジー",
    slug: "technology",
    parentId: null,
    thumbnail: null,
    order: 0,
    description: "テクノロジーに関する記事",
  });
  if (!techResult.success) throw new Error("Failed to create category: テクノロジー");
  const tech = techResult.data;
  console.log(`  Created: ${tech.name} (${tech.id})`);

  const designResult = await createCategory({
    name: "デザイン",
    slug: "design",
    parentId: null,
    thumbnail: null,
    order: 1,
    description: "デザインに関する記事",
  });
  if (!designResult.success) throw new Error("Failed to create category: デザイン");
  const design = designResult.data;
  console.log(`  Created: ${design.name} (${design.id})`);

  const businessResult = await createCategory({
    name: "ビジネス",
    slug: "business",
    parentId: null,
    thumbnail: null,
    order: 2,
    description: "ビジネスに関する記事",
  });
  if (!businessResult.success) throw new Error("Failed to create category: ビジネス");
  const business = businessResult.data;
  console.log(`  Created: ${business.name} (${business.id})`);

  // Child categories
  const frontendResult = await createCategory({
    name: "フロントエンド",
    slug: "frontend",
    parentId: tech.id,
    thumbnail: null,
    order: 0,
    description: "フロントエンド開発に関する記事",
  });
  if (!frontendResult.success) throw new Error("Failed to create category: フロントエンド");
  const frontend = frontendResult.data;
  console.log(`  Created: ${frontend.name} (${frontend.id})`);

  const backendResult = await createCategory({
    name: "バックエンド",
    slug: "backend",
    parentId: tech.id,
    thumbnail: null,
    order: 1,
    description: "バックエンド開発に関する記事",
  });
  if (!backendResult.success) throw new Error("Failed to create category: バックエンド");
  const backend = backendResult.data;
  console.log(`  Created: ${backend.name} (${backend.id})`);

  // --- Posts ---
  console.log("Creating posts...");

  const now = new Date();

  const posts = [
    {
      title: "React 19の新機能まとめ",
      slug: "react-19-new-features",
      content: "React 19で導入された新機能について解説します。Server Components、Actions、新しいフックなど。",
      categoryId: frontend.id,
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      title: "TypeScriptの型パズル入門",
      slug: "typescript-type-puzzles",
      content: "TypeScriptの高度な型システムを使ったテクニックを紹介します。Conditional Types、Template Literal Types など。",
      categoryId: frontend.id,
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Node.jsのパフォーマンス最適化",
      slug: "nodejs-performance-optimization",
      content: "Node.jsアプリケーションのパフォーマンスを改善するためのベストプラクティスを紹介します。",
      categoryId: backend.id,
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      title: "DynamoDBのデータモデリング",
      slug: "dynamodb-data-modeling",
      content: "DynamoDBで効率的なデータモデルを設計する方法について解説します。Single Table Designパターンなど。",
      categoryId: backend.id,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      title: "UIデザインの基本原則",
      slug: "ui-design-principles",
      content: "優れたUIデザインを作るための基本原則を紹介します。コントラスト、整列、反復、近接の4原則。",
      categoryId: design.id,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      title: "スタートアップのプロダクト戦略",
      slug: "startup-product-strategy",
      content: "スタートアップがプロダクトマーケットフィットを達成するための戦略について解説します。",
      categoryId: business.id,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const post of posts) {
    const result = await createPost(post);
    if (!result.success) throw new Error(`Failed to create post: ${post.title}`);
    console.log(`  Created: ${result.data.title} (${result.data.id})`);
  }

  console.log("\nDone! Created 5 categories and 6 posts.");
}