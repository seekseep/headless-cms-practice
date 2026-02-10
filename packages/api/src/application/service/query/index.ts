import {
  makeFindPostByIdQuery,
  makeListPostsQuery,
  makeListPostsByCategoryIdQuery,
  makeFindCategoryByIdQuery,
  makeListAllCategoriesQuery,
  makeListCategoriesByParentIdQuery,
  makeGetUserByCredentialQuery,
} from "@headless-cms-practice/aws-service";

const tableConfig = { tableName: process.env.TABLE_NAME! };
const userPoolConfig = { userPoolId: process.env.USER_POOL_ID!, region: process.env.AWS_REGION! };

export const findPostByIdQuery = makeFindPostByIdQuery(tableConfig);
export const listPostsQuery = makeListPostsQuery(tableConfig);
export const listPostsByCategoryIdQuery = makeListPostsByCategoryIdQuery(tableConfig);
export const findCategoryByIdQuery = makeFindCategoryByIdQuery(tableConfig);
export const listAllCategoriesQuery = makeListAllCategoriesQuery(tableConfig);
export const listCategoriesByParentIdQuery = makeListCategoriesByParentIdQuery(tableConfig);
export const getUserByCredentialQuery = makeGetUserByCredentialQuery(userPoolConfig);
