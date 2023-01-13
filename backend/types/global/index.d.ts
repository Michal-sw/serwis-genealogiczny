declare global {
    namespace Express {
        interface User {
            login?: string
        }
    }
}

export {}