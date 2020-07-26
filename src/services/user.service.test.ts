// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { UserService } from './user.service';

import { request } from './__mocks__/express';

import { Database, UserEntity } from '../lib/types';
import { connectDatabase } from '../database';

const userService = new UserService();

describe('QUERIES', () => {
    let db: Database;
    beforeAll(async () => {
        db = await connectDatabase();
    });
    afterAll(async () => {
        await db.client.close();
    });

    test('The User query returns a user', async () => {
        const testUserId = '5d378db94e84753160e08b55';
        const returnedUser: UserEntity = await userService.queryUser({
            id: testUserId,
            db,
            req: request,
        });
        expect(returnedUser).toBeTruthy();
        expect(returnedUser).not.toBeNull();
        expect(returnedUser._id).toEqual(testUserId);
    });
});
