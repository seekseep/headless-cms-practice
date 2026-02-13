import {
  makeCreatePostCommand,
  makeUpdatePostCommand,
  makeDeletePostCommand,
  makeCreateCategoryCommand,
  makeUpdateCategoryCommand,
  makeDeleteCategoryAndChildrenCommand,
  makeCreateUploadUrlCommand,
} from "@headless-cms-practice/aws-service";

const postsTableConfig = { tableName: process.env.POSTS_TABLE_NAME! };
const categoriesTableConfig = { tableName: process.env.CATEGORIES_TABLE_NAME! };
const bucketConfig = { backetName: process.env.ASSET_BUCKET_NAME!, assetBaseUrl: process.env.ASSET_BASE_URL! };

export const createPostCommand = makeCreatePostCommand(postsTableConfig);
export const updatePostCommand = makeUpdatePostCommand(postsTableConfig);
export const deletePostCommand = makeDeletePostCommand(postsTableConfig);
export const createCategoryCommand = makeCreateCategoryCommand(categoriesTableConfig);
export const updateCategoryCommand = makeUpdateCategoryCommand(categoriesTableConfig);
export const deleteCategoryAndChildrenCommand = makeDeleteCategoryAndChildrenCommand(categoriesTableConfig);
export const createUploadUrlCommand = makeCreateUploadUrlCommand(bucketConfig);
