// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { ListingService } from './listing.service';

import { request } from './__mocks__/express';

import { Database, ListingEntity, ListingsData, ListingsFilter } from '../lib/types';
import { connectDatabase } from '../database';

const listingService = new ListingService();

describe('QUERIES', () => {
    let db: Database;
    beforeAll(async () => {
        db = await connectDatabase();
    });
    afterAll(async () => {
        await db.client.close();
    });

    test('Listing Query by ID returns a single listing', async () => {
        const returnedListing: ListingEntity = await listingService.queryListing({
            id: '5d378db94e84753160e08b30',
            db,
            req: request,
        });
        expect(returnedListing).toBeTruthy();
        expect(returnedListing.numOfGuests).toBe(3);
    });

    test('Query listings returns all listings', async () => {
        const allListings: ListingsData = await listingService.queryListings({
            db,
            location: null,
            filter: ListingsFilter.PRICE_LOW_TO_HIGH,
            limit: 4,
            page: 1,
        });
        expect(allListings).toBeTruthy();
        expect(allListings.total).toBeGreaterThan(1);
        expect(allListings.result).toBeInstanceOf(Array);
        expect(allListings.result[0].price).toBeLessThan(allListings.result[1].price);
    });
});
