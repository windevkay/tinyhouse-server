import { ObjectID } from 'mongodb';
import { Request } from 'express';

import { Database, ListingEntity } from '../lib/types';
import { authorize } from '../lib/utils';

/**
 * Query for a single listing using their id
 * @param params listing id, db object
 */
export class ListingService {
    public queryListing = async (params: { id: string; db: Database; req: Request }): Promise<ListingEntity> => {
        const { id, db, req } = params;
        try {
            const listing = await db.listings.findOne({ _id: new ObjectID(id) });
            if (!listing) {
                throw new Error('Listing cannot be found');
            }
            const viewer = await authorize(db, req);
            if (viewer && viewer._id === listing.host) {
                listing.authorized = true;
            }
            return Promise.resolve(listing);
        } catch (error) {
            return Promise.reject(`Failed to query listing: ${error}`);
        }
    };
}
