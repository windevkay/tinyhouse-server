import { IResolvers } from 'apollo-server-express';

import { Database } from '../lib/types';
import { ListingEntity } from '../types/types';

import ListingsService from '../services/listings.service';

const listingsService = new ListingsService();

export const resolvers: IResolvers = {
    Query: {
        listings: async (_root: undefined, _args: unknown, { db }: { db: Database }): Promise<ListingEntity[]> => {
            return await listingsService.queryAllListings({ db });
        },
    },
    Mutation: {
        deleteListing: async (
            _root: undefined,
            { id }: { id: string },
            { db }: { db: Database },
        ): Promise<ListingEntity> => {
            return await listingsService.mutationDeleteListing({ db, id });
        },
    },
    //we need to explicitly resolve our schema id to the _id of mongo db
    Listing: {
        id: (listing: ListingEntity): string => listing._id.toString(),
    },
};
