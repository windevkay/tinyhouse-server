'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.typeDefs = void 0;
const apollo_server_express_1 = require('apollo-server-express');
exports.typeDefs = apollo_server_express_1.gql`
    type Listing {
        id: ID!
        title: String!
        image: String!
        address: String!
        price: Int!
        numOfGuests: Int!
        numOfBeds: Int!
        numOfBaths: Int!
        rating: Int!
    }

    type Query {
        listings: [Listing!]!
    }

    type Mutation {
        deleteListing(id: ID!): Listing!
    }
`;
