import express, { Express } from 'express';
import dotenv from 'dotenv';
import connectToMongoDB from './config/mongoClient';
import logger from './middlewares/logger';
import passport from './middlewares/passport';
import corsMiddleware from './middlewares/cors';

dotenv.config();
const port = process.env.PORT || 8080;

const app: Express = express();

app.use(logger);
app.use(corsMiddleware);
app.use(passport.initialize());


const runApp = async () => {
    await connectToMongoDB()
        .then(message => {
            app.listen(port, () => {
                console.log(message);
                console.log(`App listening on ${port}`);
            });
        })
        .catch(message => {
            console.log(message);
        });
}
  
runApp();