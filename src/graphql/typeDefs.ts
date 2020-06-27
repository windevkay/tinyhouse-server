import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    enum ListingType {
        APARTMENT
        HOUSE
    }

    scalar BookingsIndexMonth {
        [key: string]: Boolean!;
    }

    scalar BookingsIndexYear {
        [key: string]: BookingsIndexMonth!;
    }

    type Listing @entity {
        id: ID! @id
        title: String! @column
        description: String! @column
        image: String! @column
        host: User! @link
        type: ListingType! @column
        address: String! @column
        country: String! @column
        admin: String! @column
        city: String! @column
        bookings: [Booking]! @link
        bookingsIndex: BookingsIndexYear! @column
    }

    type User @entity {
        id: ID! @id
        token: String! @column
        name: String! @column
        avatar: String! @column
        contact: String! @column
        walletId: String @column
        income: Int! @column
        bookings: [Booking]! @link
        listings: [Listing]! @link
    }

    type Booking @entity {
        id: ID! @id
    }

    type Query {
        listings: [Listing!]!
    }

    type Mutation {
        deleteListing(id: ID!): Listing!
    }
`;
