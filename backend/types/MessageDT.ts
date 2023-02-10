import { ObjectId } from "mongoose";

export interface MessageDT {
    text: string;
    author: ObjectId;
}
