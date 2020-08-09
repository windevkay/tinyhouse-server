import { Request } from 'express';

import { Stripe } from './requests';
import { Database, UserEntity, Viewer } from '../lib/types';
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
    /**
     * Connect to a users stripe account and get their account ID
     * @param params stripe code, db object, request object
     */
    public mutationConnectStripe = async (params: {
        input: { code: string };
        db: Database;
        req: Request;
    }): Promise<Viewer> => {
        const { input, db, req } = params;
        try {
            const { code } = input;
            let viewer = await authorize(db, req);
            if (!viewer) {
                throw new Error('viewer cannot be found or not authorized');
            }
            //get stripe details
            const wallet = await Stripe.connect(code);
            if (!wallet) {
                throw new Error('Stripe grant error');
            }
            //update user wallet id with the stripe user id
            const updateRes = await db.users.findOneAndUpdate(
                { _id: viewer._id },
                { $set: { walletId: wallet.stripe_user_id } },
                { returnOriginal: false },
            );
            if (!updateRes.value) {
                throw new Error('viewer could not be updated');
            }

            viewer = updateRes.value;

            return {
                _id: viewer._id,
                token: viewer.token,
                avatar: viewer.avatar,
                walletId: viewer.walletId,
                didRequest: true,
            };
        } catch (error) {
            return Promise.reject(`Failed to connect to Stripe: ${error}`);
        }
    };
    /**
     * Disconnect stripe
     * @param params db object and request object
     */
    public mutationDisconnectStripe = async (params: { db: Database; req: Request }): Promise<Viewer> => {
        const { db, req } = params;
        try {
            let viewer = await authorize(db, req);
            if (!viewer) {
                throw new Error('viewer cannot be found or not authorized');
            }
            const updateRes = await db.users.findOneAndUpdate(
                { _id: viewer._id },
                { $set: { walletId: undefined } },
                { returnOriginal: false },
            );
            if (!updateRes.value) {
                throw new Error('viewer could not be updated');
            }

            viewer = updateRes.value;

            return {
                _id: viewer._id,
                token: viewer.token,
                avatar: viewer.avatar,
                walletId: viewer.walletId,
                didRequest: true,
            };
        } catch (error) {
            return Promise.reject(`Failed to disconnect from Stripe: ${error}`);
        }
    };
}
