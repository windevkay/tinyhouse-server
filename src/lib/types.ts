//Custom Types for MongoDB
import { Collection } from 'mongodb';
import { ListingEntity, UserEntity, BookingEntity } from '../types/types';

export interface Database {
    bookings: Collection<BookingEntity>;
    listings: Collection<ListingEntity>;
    users: Collection<UserEntity>;
}
