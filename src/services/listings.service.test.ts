// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { ObjectId } from 'mongodb';

import { connectDatabase } from '../database';

import ListingsService from './listings.service';
import { Database } from '../lib/types';
import { ListingEntity } from '../types/types';

const listingsService = new ListingsService();

describe('QUERIES', () => {
    let db: Database;
    //establish db connection before tests to ensure db isnt undefined
    beforeAll(async () => {
        db = await connectDatabase();
    });

    test('The method fetches and returns all listings', async () => {
        const returnedListings: ListingEntity[] = await listingsService.queryAllListings({ db });
        expect(returnedListings.length).toBeGreaterThan(0);
    });
});

describe('MUTATIONS', () => {
    let db: Database;
    beforeAll(async () => {
        db = await connectDatabase();
    });

    test('Given a listingID, the method should delete it', async () => {
        //seed db with mock data first before testing a delete
        const mockListingId = new ObjectId('507c7f79bcf86cd7994f6c0e');
        const mockListing: ListingEntity = {
            _id: mockListingId,
            title: 'Clean and fully furnished apartment. 5 min away from CN Tower',
            image:
                'https://res.cloudinary.com/tiny-house/image/upload/v1560641352/mock/Toronto/toronto-listing-1_exv0tf.jpg',
            address: '3210 Scotchmere Dr W, Toronto, ON, CA',
            price: 10000,
            numOfGuests: 2,
            numOfBeds: 1,
            numOfBaths: 2,
            rating: 5,
        };
        await db.listings.insertOne(mockListing);
        await listingsService.mutationDeleteListing({ db, id: '507c7f79bcf86cd7994f6c0e' });

        const listingsLeft: ListingEntity[] = await listingsService.queryAllListings({ db });
        for (let i = 0; i < listingsLeft.length; i++) {
            expect(listingsLeft[i]._id).not.toBe('507c7f79bcf86cd7994f6c0e');
        }
    });
});
