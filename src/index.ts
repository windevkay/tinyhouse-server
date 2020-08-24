// eslint-disable-next-line @typescript-eslint/no-var-requires
//require('dotenv').config(); //turn this off when deploying, on in development

import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import { connectDatabase } from './database';

import { typeDefs, resolvers } from './graphql';

const port = process.env.PORT;

const mount = async (app: Application) => {
    const db = await connectDatabase();
    //set body parser and limit requests to 2mb
    app.use(bodyParser.json({ limit: '2mb' }));
    //set cookie parsing middleware
    app.use(cookieParser(process.env.SECRET));
    //compress responses
    app.use(compression());
    //we will serve the frontend using this node server
    app.use(express.static(`${__dirname}/client`));
    //for any incoming requests, serve the compile html file for the frontend
    app.get('/*', (_req, res) => res.sendFile(`${__dirname}/client/index.html`));

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
