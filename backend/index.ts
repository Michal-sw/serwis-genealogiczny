import express, { Express } from 'express';
import dotenv from 'dotenv';
import connectToMongoDB from './config/mongoClient';

dotenv.config();
const app: Express = express();

const port = process.env.PORT || 8080;

const runApp = async () => {
    await connectToMongoDB()
        .then((e) => {
            app.listen(port, () => {
                console.log(e);
                console.log(`App listening on ${port}`);
            });
        })
        .catch((e) => {
            console.log(e);
        });
}
  
  runApp();