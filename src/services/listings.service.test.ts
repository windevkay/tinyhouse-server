// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

//import { ObjectId } from 'mongodb';

import { connectDatabase } from '../database';

import ListingsService from './listings.service';
import { Database, ListingEntity } from '../lib/types';

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
    // let db: Database;
    // beforeAll(async () => {
    //     db = await connectDatabase();
    // });
    //mutation tests go here
});
