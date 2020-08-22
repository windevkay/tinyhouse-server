// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { connectDatabase } from './database';

import { typeDefs, resolvers } from './graphql';

const port = process.env.PORT;

const mount = async (app: Application) => {
    const db = await connectDatabase();
    //set body parser and limit requests to 2mb
    app.use(bodyParser.json({ limit: '2mb' }));
    //set cookie parsing middleware
    app.use(cookieParser(process.env.SECRET));
    // create apollo server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => ({ db, req, res }),
    });
    server.applyMiddleware({ app, path: '/api' });

    app.listen(port);
    console.log(`[app]: http://localhost:${port}`);
};

mount(express());
