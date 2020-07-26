import { ObjectID } from 'mongodb';
import { Request } from 'express';

import {
    Database,
    ListingEntity,
    ListingsFilter,
    ListingsData,
    ListingsGeocodeQuery,
    GoogleGeocodeResult,
} from '../lib/types';
import { authorize } from '../lib/utils';
import { Google } from './requests';

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
        location: string | null;
        filter: ListingsFilter;
        limit: number;
        page: number;
    }): Promise<ListingsData> => {
        const { db, location, filter, limit, page } = params;
        try {
            const query: ListingsGeocodeQuery = {};
            const data: ListingsData = { region: null, total: 0, result: [] };

            if (location) {
                const { country, admin, city }: GoogleGeocodeResult = await Google.geocode(location);
                if (city) query.city = city;
                if (admin) query.admin = admin;
                if (country) {
                    query.country = country;
                } else {
                    throw new Error('No country found');
                }
                //create the region string
                const cityText = city ? `${city}, ` : '';
                const adminText = admin ? `${admin}, ` : '';
                data.region = `${cityText}${adminText}${country}`;
            }
            //if query is empty, all listings will be returned, else it will return based on geocode result
            let cursor = await db.listings.find(query);

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
