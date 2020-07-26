import { Response, Request } from 'express';

import MockExpressRequest from 'mock-express-request';
import MockExpressResponse from 'mock-express-response';

//req and res mocks
export const response: Response = new MockExpressResponse();
export const request: Request = new MockExpressRequest({
    signedCookies: {
        viewer: '5d378db94e84753160e08b55',
    },
    //functions
    get: (csrf: string) => {
        if (csrf === 'X-CSRF-TOKEN') {
            return 'f89f55e74c080778dfc9eab8cd9282e8';
        }
    },
});
