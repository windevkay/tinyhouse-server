'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express = require('express');
const apollo_server_express_1 = require('apollo-server-express');
const graphql_1 = require('./graphql');
const app = express();
const port = 9000;
// create apollo server
const server = new apollo_server_express_1.ApolloServer({ schema: graphql_1.schema });
server.applyMiddleware({ app, path: '/api' });
app.listen(port);
console.log(`[app]: http://localhost:${port}`);
