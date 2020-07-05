import { Request } from 'express';

import { Database, UserEntity } from '../lib/types';
import { authorize } from '../lib/utils';

export class UserService {
    /**
     * Query for a single user using their id
     * @param params user id, db object and request object
     */
    public queryUser = async (params: { id: string; db: Database; req: Request }): Promise<UserEntity> => {
        const { id, db, req } = params;
        try {
            const user = await db.users.findOne({ _id: id });
            if (!user) {
                throw new Error('User was not found');
            }
            //check if user making the query is authorized to see certain info
            const viewer = await authorize(db, req);
            if (viewer && viewer._id === user._id) {
                user.authorized = true;
            }
            return Promise.resolve(user);
        } catch (error) {
            return Promise.reject(`Failed to query user: ${error}`);
        }
    };
}
