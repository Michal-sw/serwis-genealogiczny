import { MongooseError } from "mongoose";
import Chat, { IChat } from "../config/models/Chat";
import { MessageDT } from "../types/MessageDT";

const getCorrectObject = (result: any) => ({ result, statusCode: 200 })
const getErrorObject = (statusCode: number, message?: string) => ({ statusCode, result: message })

export const getGlobalChat = async () => {
    const result = await Chat
        .find()
        .then((chat: [IChat] | any) => getCorrectObject(chat))
        .catch((err: MongooseError) => getErrorObject(500, err.message));

    return result;
}

export const addMessage = async (message: MessageDT) => {
    const result = await Chat
        .findOneAndUpdate({}, 
            { $push: {
                messages: {
                        'author': message.author,
                        'text': message.text
                    }
                }
            }    
        , { sort: { _id: 1 } })
        .then((chat: [IChat] | any) => getCorrectObject(chat))
        .catch((err: MongooseError) => getErrorObject(500, err.message));

    return result;
}