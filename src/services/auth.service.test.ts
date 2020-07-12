// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { AuthService } from './auth.service';

//import express, { Response, Request } from 'express';

//import MockExpressRequest from 'mock-express-request';
//import MockExpressResponse from 'mock-express-response';

//import { Database, Viewer } from '../lib/types';
//import { connectDatabase } from '../database';

const authService = new AuthService();

describe('QUERIES', () => {
    test('That queryAuthUrl returns a string', async () => {
        const authURL = await authService.queryAuthUrl();
        expect(typeof authURL).toBe('string');
        expect(authURL).not.toBeUndefined();
    });
});

// describe('MUTATIONS', () => {
//     //let db: Database;
//     beforeAll(async () => {
//         //db = await connectDatabase();
//         mount(express());
//     });
// });
