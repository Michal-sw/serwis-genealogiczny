import { MongooseError } from "mongoose";
import User, { IUser } from "../config/models/User";
import { LoginDT } from "../types/LoginDT";

const getCorrectObject = (result: any) => ({ result, statusCode: 200 })
const getErrorObject = (statusCode: number, message?: string) => ({ statusCode, result: message })

export const getUsers = async () => {
    const result = await User
        .find()
        .then((users: [IUser] | any) => getCorrectObject(users))
        .catch((err: MongooseError) => getErrorObject(500, err.message));

    return result;
}

export const getUserIfPasswordMatches = async ({ login, password }: LoginDT) => {
    const user: IUser | null = await User
        .findOne({ login })

    return (user && user.password === password) 
        ? user
        : null;
}

export const addUser = async ({ login, password }: LoginDT) => {
    if (!login || !password) {
        return getErrorObject(400);
    }

    const result = await User.create({
        login,
        password
    })
    .then((user: IUser) => getCorrectObject(user))
    .catch((err: MongooseError) => getErrorObject(400, err.message));

    return result;
};

export const getUserById = async (id: string) => {
    const user = await User.findById(id);
    if (!user) {
        return getErrorObject(404);
    }
    return getCorrectObject(user);
};

export const replaceUser = async ({ id, ...body }: {id:string}) => {
    const user = await User.findOneAndReplace({id}, body);
    
    return getCorrectObject(user);
};

export const deleteUser = async (id: string) => {
    await User.findOneAndDelete({ id })
        .then((user: IUser | null) => {
            return getCorrectObject(user);
        }).catch((err: MongooseError) => {
            return getErrorObject(400, err.message);
        });
};

export const editUser = async ({ id, ...body }: {id:string}) => {
    const user = await User.findOneAndUpdate({id}, body);
    
    return getCorrectObject(user);
};
