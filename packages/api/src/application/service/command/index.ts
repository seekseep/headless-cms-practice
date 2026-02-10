import {
  makeCreatePostCommand,
  makeUpdatePostCommand,
  makeDeletePostCommand,
  makeCreateCategoryCommand,
  makeUpdateCategoryCommand,
  makeDeleteCategoryAndChildrenCommand,
  makeCreateUploadUrlCommand,
} from "aws-service";

const tableConfig = { tableName: process.env.TABLE_NAME! };
const backetConfig = { backetName: process.env.BACKET_NAME! };

export const createPostCommand = makeCreatePostCommand(tableConfig);
export const updatePostCommand = makeUpdatePostCommand(tableConfig);
export const deletePostCommand = makeDeletePostCommand(tableConfig);
export const createCategoryCommand = makeCreateCategoryCommand(tableConfig);
export const updateCategoryCommand = makeUpdateCategoryCommand(tableConfig);
export const deleteCategoryAndChildrenCommand = makeDeleteCategoryAndChildrenCommand(tableConfig);
export const createUploadUrlCommand = makeCreateUploadUrlCommand(backetConfig);
