import { Driver, driver, auth } from 'neo4j-driver';
import dotenv from 'dotenv';
dotenv.config();

const dbConnData = {
  uri: process.env.NEO4J_URI || 'bolt://127.0.0.1:7687',
  user: process.env.NEO4J_USER || 'neo4j',
  password: process.env.NEO4J_PASSWORD || 'password',
};

const neoDriver: Driver = 
    driver(
        dbConnData.uri,
        auth.basic(dbConnData.user, dbConnData.password)
    );

export default neoDriver;
