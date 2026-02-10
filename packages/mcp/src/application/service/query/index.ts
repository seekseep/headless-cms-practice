import {
  makeFindPostByIdQuery,
  makeListPostsQuery,
  makeListPostsByCategoryIdQuery,
  makeFindCategoryByIdQuery,
  makeListAllCategoriesQuery,
  makeListCategoriesByParentIdQuery,
} from "aws-service";

const postsTableConfig = { tableName: process.env.POSTS_TABLE_NAME! };
const categoriesTableConfig = { tableName: process.env.CATEGORIES_TABLE_NAME! };

export const findPostByIdQuery = makeFindPostByIdQuery(postsTableConfig);
export const listPostsQuery = makeListPostsQuery(postsTableConfig);
export const listPostsByCategoryIdQuery = makeListPostsByCategoryIdQuery(postsTableConfig);
export const findCategoryByIdQuery = makeFindCategoryByIdQuery(categoriesTableConfig);
export const listAllCategoriesQuery = makeListAllCategoriesQuery(categoriesTableConfig);
export const listCategoriesByParentIdQuery = makeListCategoriesByParentIdQuery(categoriesTableConfig);
