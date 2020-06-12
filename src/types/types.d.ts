export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
};

export type Listing = {
    __typename?: 'Listing';
    id: Scalars['ID'];
    title: Scalars['String'];
    image: Scalars['String'];
    address: Scalars['String'];
    price: Scalars['Int'];
    numOfGuests: Scalars['Int'];
    numOfBeds: Scalars['Int'];
    numOfBaths: Scalars['Int'];
    rating: Scalars['Int'];
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
