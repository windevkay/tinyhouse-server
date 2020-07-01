import { IResolvers } from 'apollo-server-express';

import { Viewer, LoginArgs, Database } from '../lib/types';

import AuthService from '../services/auth.service';

const authService = new AuthService();

export const resolvers: IResolvers = {
    Query: {
        //AUTH
        authUrl: async (): Promise<string> => await authService.queryAuthUrl(),
    },
    Mutation: {
        //AUTH
        logIn: async (_root: undefined, { input }: LoginArgs, { db }: { db: Database }): Promise<Viewer> =>
            await authService.mutationLogin({ input, db }),

        logOut: (): Viewer => authService.mutationLogOut(),
    },
    //resolving some fields
    Viewer: {
        id: (viewer: Viewer): string | undefined => {
            return viewer._id;
        },
        hasWallet: (viewer: Viewer): boolean | undefined => {
            return viewer.walletId ? true : undefined;
        },
    },
};
