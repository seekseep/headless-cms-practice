import {
  makeCreatePostCommand,
  makeUpdatePostCommand,
  makeDeletePostCommand,
  makeCreateCategoryCommand,
  makeUpdateCategoryCommand,
  makeDeleteCategoryAndChildrenCommand,
} from "aws-service";

const postsTableConfig = { tableName: process.env.POSTS_TABLE_NAME! };
const categoriesTableConfig = { tableName: process.env.CATEGORIES_TABLE_NAME! };

export const createPostCommand = makeCreatePostCommand(postsTableConfig);
export const updatePostCommand = makeUpdatePostCommand(postsTableConfig);
export const deletePostCommand = makeDeletePostCommand(postsTableConfig);
export const createCategoryCommand = makeCreateCategoryCommand(categoriesTableConfig);
export const updateCategoryCommand = makeUpdateCategoryCommand(categoriesTableConfig);
export const deleteCategoryAndChildrenCommand = makeDeleteCategoryAndChildrenCommand(categoriesTableConfig);
