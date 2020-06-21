export type Maybe<T> = T | null;
import { ObjectID } from 'mongodb';
export type ListingEntity = {
    _id: ObjectID;
    title: string;
    description: string;
    host: UserEntity['_id'];
    type: string;
    address: string;
    country: string;
    admin: string;
    city: string;
    bookings: Array<Maybe<BookingEntity['_id']>>;
};

export type UserEntity = {
    _id: ObjectID;
    token: string;
    name: string;
    avatar: string;
    contact: string;
    walletId?: Maybe<string>;
    income: number;
    bookings: Array<Maybe<BookingEntity['_id']>>;
    listings: Array<Maybe<ListingEntity['_id']>>;
};

export type BookingEntity = {
    _id: ObjectID;
};

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
};

export enum ListingType {
    Apartment = 'APARTMENT',
    House = 'HOUSE',
}

export type Listing = {
    __typename?: 'Listing';
    id: Scalars['ID'];
    title: Scalars['String'];
    description: Scalars['String'];
    host: User;
    type: ListingType;
    address: Scalars['String'];
    country: Scalars['String'];
    admin: Scalars['String'];
    city: Scalars['String'];
    bookings: Array<Maybe<Booking>>;
};

export type User = {
    __typename?: 'User';
    id: Scalars['ID'];
    token: Scalars['String'];
    name: Scalars['String'];
    avatar: Scalars['String'];
    contact: Scalars['String'];
    walletId?: Maybe<Scalars['String']>;
    income: Scalars['Int'];
    bookings: Array<Maybe<Booking>>;
    listings: Array<Maybe<Listing>>;
};

export type Booking = {
    __typename?: 'Booking';
    id: Scalars['ID'];
};

export type Query = {
    __typename?: 'Query';
    listings: Array<Listing>;
};

export type Mutation = {
    __typename?: 'Mutation';
    deleteListing: Listing;
};

export type MutationDeleteListingArgs = {
    id: Scalars['ID'];
};

export type AdditionalEntityFields = {
    path?: Maybe<Scalars['String']>;
    type?: Maybe<Scalars['String']>;
};
