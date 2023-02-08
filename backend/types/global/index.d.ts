import { ObjectId } from "mongoose"

declare global {
    namespace Express {
        interface User {
            _id?: ObjectId,
            login?: string,
            password?: string
        }
    }
}

export {}