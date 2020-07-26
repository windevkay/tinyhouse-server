import { IResolvers } from 'apollo-server-express';
import { Response, Request } from 'express';

import {
    Viewer,
    LoginArgs,
    UserEntity,
    UserArgs,
    Database,
    UserBookingsArgs,
    UserBookingsData,
    UserListingsArgs,
    UserListingsData,
    ListingEntity,
    BookingEntity,
    ListingArgs,
    ListingBookingsArgs,
    ListingBookingsData,
    ListingsArgs,
    ListingsData,
} from '../lib/types';

import { AuthService, UserService, ListingService } from '../services';

const authService = new AuthService();
const userService = new UserService();
const listingService = new ListingService();

export const resolvers: IResolvers = {
    Query: {
        //AUTH
        authUrl: async (): Promise<string> => await authService.queryAuthUrl(),
        //USER
        user: async (
            _root: undefined,
            { id }: UserArgs,
            { db, req }: { db: Database; req: Request },
        ): Promise<UserEntity> => await userService.queryUser({ id, db, req }),
        //LISTING
        listing: async (
            _root: undefined,
            { id }: ListingArgs,
            { db, req }: { db: Database; req: Request },
        ): Promise<ListingEntity> => await listingService.queryListing({ id, db, req }),
        //LISTINGS
        listings: async (
            _root: undefined,
            { location, filter, limit, page }: ListingsArgs,
            { db }: { db: Database },
        ): Promise<ListingsData> => await listingService.queryListings({ db, location, filter, limit, page }),
    },
    Mutation: {
        //AUTH
        logIn: async (
            _root: undefined,
            { input }: LoginArgs,
            { db, req, res }: { db: Database; req: Request; res: Response },
        ): Promise<Viewer> => await authService.mutationLogin({ input, db, res, req }),

        logOut: (_root: undefined, _args: undefined, { res }: { res: Response }): Viewer =>
            authService.mutationLogOut({ res }),
    },
    /**
     * Below we resolve some typescript types properties to typedef fields
     */
    Viewer: {
        id: (viewer: Viewer): string | undefined => {
            return viewer._id;
        },
        hasWallet: (viewer: Viewer): boolean | undefined => {
            return viewer.walletId ? true : undefined;
        },
    },

    User: {
        id: (user: UserEntity): string => {
            return user._id;
        },
        hasWallet: (user: UserEntity): boolean => {
            return Boolean(user.walletId);
        },
        income: (user: UserEntity): number | null => {
            return user.authorized ? user.income : null;
        },
        bookings: async (
            user: UserEntity,
            { limit, page }: UserBookingsArgs,
            { db }: { db: Database },
        ): Promise<UserBookingsData | null> => {
            try {
                if (!user.authorized) {
                    //if user isnt authroized, we want this field to be null
                    //only an authorized user should see their own bookings
                    return null;
                }
                const data: UserBookingsData = { total: 0, result: [] };
                //find the user bookings using mongo, and use the cursor to set pagination options
                let cursor = await db.bookings.find({
                    _id: { $in: user.bookings },
                });
                cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);

                data.total = await cursor.count();
                data.result = await cursor.toArray();

                return Promise.resolve(data);
            } catch (error) {
                return Promise.reject(`Failed to query user bookings: ${error}`);
            }
        },
        listings: async (
            user: UserEntity,
            { limit, page }: UserListingsArgs,
            { db }: { db: Database },
        ): Promise<UserListingsData | null> => {
            try {
                const data: UserListingsData = { total: 0, result: [] };

                let cursor = await db.listings.find({
                    _id: { $in: user.listings },
                });
                cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);

                data.total = await cursor.count();
                data.result = await cursor.toArray();

                return Promise.resolve(data);
            } catch (error) {
                return Promise.reject(`Failed to query user listings: ${error}`);
            }
        },
    },

    Listing: {
        id: (listing: ListingEntity): string => {
            return listing._id.toString();
        },
        host: async (listing: ListingEntity, _args: undefined, { db }: { db: Database }): Promise<UserEntity> => {
            const host = await db.users.findOne({ _id: listing.host });
            if (!host) {
                throw new Error('Host for listing cannot be found');
            }
            return host;
        },
        bookingsIndex: (listing: ListingEntity): string => {
            return JSON.stringify(listing.bookingsIndex);
        },
        bookings: async (
            listing: ListingEntity,
            { limit, page }: ListingBookingsArgs,
            { db }: { db: Database },
        ): Promise<ListingBookingsData | null> => {
            try {
                if (!listing.authorized) {
                    return null;
                }
                const data: ListingBookingsData = { total: 0, result: [] };
                let cursor = await db.bookings.find({
                    _id: { $in: listing.bookings },
                });
                cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);

                data.total = await cursor.count();
                data.result = await cursor.toArray();

                return Promise.resolve(data);
            } catch (error) {
                return Promise.reject(`Failed to query listing bookings: ${error}`);
            }
        },
    },

    Booking: {
        id: (booking: BookingEntity): string => {
            return booking._id.toString();
        },
        listing: (
            booking: BookingEntity,
            _args: undefined,
            { db }: { db: Database },
        ): Promise<ListingEntity | null> => {
            return db.listings.findOne({ _id: booking.listing });
        },
    },
};
