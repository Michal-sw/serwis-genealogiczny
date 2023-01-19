import { ObjectId, Schema, model } from "mongoose";

export interface IUser {
    _id: ObjectId;
    login: string;  
    password: string;
    firstName?: string;
    lastName?: string;
    refreshToken?: string;
};

const userSchema = new Schema<IUser>({
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
});

export default model('User', userSchema);