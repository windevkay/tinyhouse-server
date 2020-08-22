import { ObjectID } from 'mongodb';
import { Request } from 'express';

import {
    Database,
    ListingEntity,
    ListingsFilter,
    ListingsData,
    ListingType,
    ListingsGeocodeQuery,
    GoogleGeocodeResult,
    HostListingInput,
} from '../lib/types';
import { authorize } from '../lib/utils';
import { Google, Cloudinary } from './requests';

export class ListingService {
    /**
     * Mutation to create a new listing
     * @param params listing input, db object, request object
     */
    public mutationHostListing = async (params: {
        input: HostListingInput;
        db: Database;
        req: Request;
    }): Promise<ListingEntity> => {
        const { input, db, req } = params;
        try {
            this.middlewareVerifyHostListingInput(input);

            const viewer = await authorize(db, req);
            if (!viewer) {
                throw new Error('Viewer cannot be found');
            }

            const { country, admin, city } = await Google.geocode(input.address);
            if (!country || !admin || !city) {
                throw new Error('Invalid address input');
            }
            //upload image to cloud
            const imageUrl = await Cloudinary.upload(input.image);

            //if all is well at this point, then create the listing
            const insertResult = await db.listings.insertOne({
                _id: new ObjectID(),
                ...input,
                image: imageUrl,
                bookings: [],
                bookingsIndex: {},
                country,
                admin,
                city,
                host: viewer._id,
            });
            //associate the listing with the users listings
            const insertedListing: ListingEntity = insertResult.ops[0];
            await db.users.updateOne({ _id: viewer._id }, { $push: { listings: insertedListing._id } });

            return Promise.resolve(insertedListing);
        } catch (error) {
            return Promise.reject(`Failed to create listing: ${error}`);
        }
    };
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

    private middlewareVerifyHostListingInput = (listingInput: HostListingInput) => {
        const { title, description, type, price } = listingInput;
        if (title.length > 100) {
            throw new Error('Listing title must be under 100 characters');
        }
        if (description.length > 5000) {
            throw new Error('Listing description must be under 5000 characters');
        }
        if (type !== ListingType.Apartment && type !== ListingType.House) {
            throw new Error('Listing type must be either an apartment or house');
        }
        if (price <= 0) {
            throw new Error('Listing price must be greater than 0');
        }
    };
}
