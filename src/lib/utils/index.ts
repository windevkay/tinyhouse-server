import { Request } from 'express';

import { Database, UserEntity } from '../types';

//function for checking against CSRF attacks
export const authorize = async (db: Database, req: Request): Promise<UserEntity | null> => {
    const token = req.get('X-CSRF-TOKEN');
    const viewer = await db.users.findOne({
        _id: req.signedCookies.viewer,
        token,
    });
    return viewer;
};
