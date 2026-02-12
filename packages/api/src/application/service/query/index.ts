import {
  makeFindPostByIdQuery,
  makeListPostsQuery,
  makeListPostsByCategoryIdQuery,
  makeFindCategoryByIdQuery,
  makeListAllCategoriesQuery,
  makeListCategoriesByParentIdQuery,
  makeGetUserByCredentialQuery,
} from "@headless-cms-practice/aws-service";

const postsTableConfig = { tableName: process.env.POSTS_TABLE_NAME! };
const categoriesTableConfig = { tableName: process.env.CATEGORIES_TABLE_NAME! };
const userPoolConfig = { userPoolId: process.env.USER_POOL_ID!, clientId: process.env.USER_POOL_CLIENT_ID!, region: process.env.AWS_REGION! };

export const findPostByIdQuery = makeFindPostByIdQuery(postsTableConfig);
export const listPostsQuery = makeListPostsQuery(postsTableConfig);
export const listPostsByCategoryIdQuery = makeListPostsByCategoryIdQuery(postsTableConfig);
export const findCategoryByIdQuery = makeFindCategoryByIdQuery(categoriesTableConfig);
export const listAllCategoriesQuery = makeListAllCategoriesQuery(categoriesTableConfig);
export const listCategoriesByParentIdQuery = makeListCategoriesByParentIdQuery(categoriesTableConfig);
export const getUserByCredentialQuery = makeGetUserByCredentialQuery(userPoolConfig);
