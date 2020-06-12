import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';

import { connectDatabase } from './database';

import { typeDefs, resolvers } from './graphql';

const port = 9000;

const mount = async (app: Application) => {
    const db = await connectDatabase();
    // create apollo server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => ({ db }),
    });
    server.applyMiddleware({ app, path: '/api' });

    app.listen(port);
    console.log(`[app]: http://localhost:${port}`);
};

mount(express());
