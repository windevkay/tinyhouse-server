import { Request } from 'express';
import { ObjectID } from 'mongodb';

import { BookingEntity, CreateBookingInput, Database, BookingsIndex } from '../lib/types';

import { authorize } from '../lib/utils';
import { Stripe } from './requests';

export class BookingService {
    public mutationCreateBooking = async (params: {
        input: CreateBookingInput;
        db: Database;
        req: Request;
    }): Promise<BookingEntity> => {
        const { input, db, req } = params;
        try {
            const { id, source, checkIn, checkOut } = input;
            //verify a logged in user is making the request
            const viewer = await authorize(db, req);
            if (!viewer) {
                throw new Error('viewer cannot be found');
            }
            //find listing document that is being booked
            const listing = await db.listings.findOne({
                _id: new ObjectID(id),
            });
            if (!listing) {
                throw new Error('listing cant be found');
            }
            //check that viewer is not booking their own listing
            if (listing.host === viewer._id) {
                throw new Error('viewer cant book own listing');
            }
            //check that checkout is not before checkin
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
            if (checkOutDate < checkInDate) {
                throw new Error('checkout date cant be before checkin date');
            }
            //create a new bookingsIndex for listing being booked
            const bookingsIndex = this.middlewareResolveBookingsIndex(listing.bookingsIndex, checkIn, checkOut);
            //get total price to charge
            const totalPrice = listing.price * ((checkOutDate.getTime() - checkInDate.getTime()) / 86400000 + 1);
            //get user document of host of listing
            const host = await db.users.findOne({
                _id: listing.host,
            });
            if (!host || !host.walletId) {
                throw new Error('host cannot be found or isnt connected with Stripe');
            }
            //create stripe charge on behalf of host
            await Stripe.charge(totalPrice, source, host.walletId);
            //insert a new booking document to bookings collection
            const insertRes = await db.bookings.insertOne({
                _id: new ObjectID(),
                listing: listing._id,
                tenant: viewer._id,
                checkIn,
                checkOut,
            });

            const insertedBooking: BookingEntity = insertRes.ops[0];
            //update user document of host to increment income
            await db.users.updateOne(
                {
                    _id: host._id,
                },
                {
                    $inc: { income: totalPrice },
                },
            );
            //update bookings field of tenant
            await db.users.updateOne(
                {
                    _id: viewer._id,
                },
                {
                    $push: { bookings: insertedBooking._id },
                },
            );
            //update bookings field of listing document
            await db.listings.updateOne(
                {
                    _id: listing._id,
                },
                {
                    $set: { bookingsIndex },
                    $push: { bookings: insertedBooking._id },
                },
            );
            //return newly inserted booking
            return Promise.resolve(insertedBooking);
        } catch (error) {
            return Promise.reject(`Failed to create booking: ${error}`);
        }
    };

    private middlewareResolveBookingsIndex = (
        bookingsIndex: BookingsIndex,
        checkInDate: string,
        checkOutDate: string,
    ): BookingsIndex => {
        let dateCursor = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const newBookingsIndex: BookingsIndex = { ...bookingsIndex };

        while (dateCursor <= checkOut) {
            const y = dateCursor.getUTCFullYear();
            const m = dateCursor.getUTCMonth();
            const d = dateCursor.getUTCDate();

            if (!newBookingsIndex[y]) {
                newBookingsIndex[y] = {};
            }

            if (!newBookingsIndex[y][m]) {
                newBookingsIndex[y][m] = {};
            }

            if (!newBookingsIndex[y][m][d]) {
                newBookingsIndex[y][m][d] = true;
            } else {
                throw new Error('selected dates cant overlap dates that have already been booked');
            }

            dateCursor = new Date(dateCursor.getTime() + 86400000);
        }

        return newBookingsIndex;
    };
}
