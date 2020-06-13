import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    type Listing @entity {
        id: ID! @id
        title: String! @column
        image: String! @column
        address: String! @column
        price: Int! @column
        numOfGuests: Int! @column
        numOfBeds: Int! @column
        numOfBaths: Int! @column
        rating: Int! @column
    }

    type Query {
        listings: [Listing!]!
    }

    type Mutation {
        deleteListing(id: ID!): Listing!
    }
`;
