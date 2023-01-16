import express, { Express } from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';

import connectToMongoDB from './config/mongoClient';
import logger from './middlewares/logger';
import passport from './middlewares/passport';
import corsMiddleware from './middlewares/cors';
import users from './routes/users';
import { createWebsocketServer } from './websockets';
import { json } from 'body-parser';

dotenv.config();
const port = process.env.PORT || 8080;

const app: Express = express();

app.use(json());
app.use(logger);
app.use(corsMiddleware);
app.use(passport.initialize());

app.use("/users", users);

const server = createServer(app);
createWebsocketServer(server);

const runApp = async () => {
    await connectToMongoDB()
        .then(message => {
            server.listen(port, () => {
                console.log(message);
                console.log(`App listening on ${port}`);
            });
        })
        .catch(message => {
            console.log(message);
        });
}

runApp();
