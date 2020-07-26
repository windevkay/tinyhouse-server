// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { AuthService } from './auth.service';

import { response, request } from './__mocks__/express';

import { Database, Viewer } from '../lib/types';
import { connectDatabase } from '../database';

const authService = new AuthService();

describe('QUERIES', () => {
    test('That queryAuthUrl returns a string', async () => {
        const authURL = await authService.queryAuthUrl();
        expect(typeof authURL).toBe('string');
        expect(authURL).not.toBeUndefined();
    });
});

describe('MUTATIONS', () => {
    let db: Database;
    beforeAll(async () => {
        db = await connectDatabase();
    });
    afterAll(async () => {
        await db.client.close();
    });

    test('Login mutation returns a Viewer via Cookie', async () => {
        const loginRequest: Viewer = await authService.mutationLogin({
            input: null,
            db,
            res: response,
            req: request,
        });
        expect(loginRequest).toBeTruthy();
        expect(loginRequest.didRequest).toEqual(true);
    });
});
