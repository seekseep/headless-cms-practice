import { AppError } from "../../error";
import { Result } from "../../../util/result/types";

export type AppResult<T> = Result<T, AppError>
