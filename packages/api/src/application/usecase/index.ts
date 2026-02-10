import {
  makeCreatePostUseCase,
  makeUpdatePostUseCase,
  makeDeletePostUseCase,
  makeGetPostUseCase,
  makeListPostsUseCase,
  makeListPostsByCategoryIdUseCase,
  makeCreateCategoryUseCase,
  makeUpdateCategoryUseCase,
  makeDeleteCategoryAndChildrenUseCase,
  makeGetCategoryUseCase,
  makeListCategoriesUseCase,
  makeListCategoriesByParentIdUseCase,
  makeCreateUploadUrlUseCase,
} from "core";

import {
  createPostCommand,
  updatePostCommand,
  deletePostCommand,
  createCategoryCommand,
  updateCategoryCommand,
  deleteCategoryAndChildrenCommand,
  createUploadUrlCommand
} from "../service/command";
import {
  findPostByIdQuery,
  listPostsQuery,
  listPostsByCategoryIdQuery,
  findCategoryByIdQuery,
  listAllCategoriesQuery,
  listCategoriesByParentIdQuery
} from "../service/query";

// Post
export const createPostUseCase = makeCreatePostUseCase({ createPostCommand });
export const updatePostUseCase = makeUpdatePostUseCase({ findPostByIdQuery, updatePostCommand });
export const deletePostUseCase = makeDeletePostUseCase({ findPostByIdQuery, deletePostCommand });
export const getPostUseCase = makeGetPostUseCase({ findPostByIdQuery });
export const listPostsUseCase = makeListPostsUseCase({ listPostsQuery });
export const listPostsByCategoryIdUseCase = makeListPostsByCategoryIdUseCase({ listPostsByCategoryIdQuery });

// Category
export const createCategoryUseCase = makeCreateCategoryUseCase({ createCategoryCommand });
export const updateCategoryUseCase = makeUpdateCategoryUseCase({ findCategoryByIdQuery, updateCategoryCommand });
export const deleteCategoryAndChildrenUseCase = makeDeleteCategoryAndChildrenUseCase({ findCategoryByIdQuery, deleteCategoryAndChildrenCommand });
export const getCategoryUseCase = makeGetCategoryUseCase({ findCategoryByIdQuery });
export const listCategoriesUseCase = makeListCategoriesUseCase({ listAllCategoriesQuery });
export const listCategoriesByParentIdUseCase = makeListCategoriesByParentIdUseCase({ listCategoriesByParentIdQuery });

// Asset
export const createUploadUrlUseCase = makeCreateUploadUrlUseCase({ createUploadUrlCommand });
