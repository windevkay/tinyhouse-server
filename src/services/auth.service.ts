import { Google } from './requests';
import crypto from 'crypto';

import { LogInInput, GoogleAuthUrl, Database, UserEntity, Viewer } from '../lib/types';

export default class AuthService {
    /**
     * Query Google for the authenticaiton URL
     * @param none
     */
    public queryAuthUrl = async (): Promise<string> => {
        try {
            return Promise.resolve(Google.authUrlRequest);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    public mutationLogin = async (params: { input: LogInInput | null; db: Database }): Promise<Viewer> => {
        const { input, db } = params;
        try {
            const code = input ? input.code : null;
            //we create a random string for session token
            const token = crypto.randomBytes(16).toString('hex');

            const viewer: UserEntity | undefined = code
                ? await this.middlewareLoginViaGoogle(code, token, db)
                : undefined;
            //if no viewer, then return object to show a request was made
            if (!viewer) {
                return { didRequest: true };
            }
            //if viewer exists, use it to populate Viewer to be returned
            return {
                _id: viewer._id,
                token: viewer.token,
                avatar: viewer.avatar,
                walletId: viewer.walletId,
                didRequest: true,
            };
        } catch (error) {
            return Promise.reject(`Failed to log in: ${error}`);
        }
    };

    private middlewareLoginViaGoogle = async (
        code: string,
        token: string,
        db: Database,
    ): Promise<UserEntity | undefined> => {
        try {
            const url: GoogleAuthUrl = await Google.logInRequest(code);
            const { user } = url;
            if (!user) {
                throw new Error(`Google login error`);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    };
}
