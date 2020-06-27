import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    #Viewer typedef represents a user on the app who could either be logged in or not
    type Viewer {
        id: ID
        token: String
        avatar: String
        hasWallet: Boolean
        didRequest: Boolean!
    }

    input LogInInput {
        code: String!
    }

    type Query {
        authUrl: String!
    }

    type Mutation {
        logIn(input: LogInInput): Viewer!
        logOut: Viewer!
    }
`;
