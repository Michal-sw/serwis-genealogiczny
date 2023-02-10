import { Types } from "mongoose";

export interface MessageDT {
    text: string;
    author: Types.ObjectId;
}
