import { Types } from "mongoose";

declare namespace Express {
  export interface Request {
    user?: any
  }
}
