import { ObjectID } from 'mongodb';
import { Request } from 'express';

import { Database, ListingEntity, ListingsFilter, ListingsData } from '../lib/types';
import { authorize } from '../lib/utils';

export class ListingService {
    /**
     * Query for a single listing by id
     * @param params listing id, db object
     */
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

    /**
     * Query to return all available listings
     * @param params db object, price filter, pagination limit, page number
     */
    public queryListings = async (params: {
        db: Database;
        filter: ListingsFilter;
        limit: number;
        page: number;
    }): Promise<ListingsData> => {
        const { db, filter, limit, page } = params;
        try {
            const data: ListingsData = { total: 0, result: [] };

            let cursor = await db.listings.find({});

            if (filter && filter === ListingsFilter.PRICE_LOW_TO_HIGH) {
                //mongo sort method - 1 for ascending, minus 1 for descending
                cursor = cursor.sort({ price: 1 });
            }

            if (filter && filter === ListingsFilter.PRICE_HIGH_TO_LOW) {
                cursor = cursor.sort({ price: -1 });
            }

            cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
            cursor = cursor.limit(limit);

            data.total = await cursor.count();
            data.result = await cursor.toArray();

            return Promise.resolve(data);
        } catch (error) {
            return Promise.reject(`Failed to query listings: ${error}`);
        }
    };
}
