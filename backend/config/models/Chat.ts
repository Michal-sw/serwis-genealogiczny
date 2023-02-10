import { ObjectId, Schema, model } from "mongoose";
import { MessageDT } from "../../types/MessageDT";

export interface IChat {
    _id: ObjectId;
    messages: MessageDT[]
};

const userSchema = new Schema<IChat>({
    messages: [
        new Schema({
          author: {
            type: Schema.Types.ObjectId,
            ref: "User"
          },
          content: {
            type: String
          },
          sentAt: {
            type: Date
          }
        }, {_id: false})
      ],
  });

export default model('User', userSchema);