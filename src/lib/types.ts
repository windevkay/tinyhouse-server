import { Collection, ObjectId } from 'mongodb';
import { people_v1 } from 'googleapis';

export enum ListingType {
    Apartment = 'APARTMENT',
    House = 'HOUSE',
}

export interface BookingsIndexMonth {
    [key: string]: boolean;
}

export interface BookingsIndexYear {
    [key: string]: BookingsIndexMonth;
}

export interface BookingsIndex {
    [key: string]: BookingsIndexYear;
}

export interface Viewer {
    _id?: string;
    token?: string;
    avatar?: string;
    walletId?: string;
    didRequest?: boolean;
}

export interface UserEntity {
    _id: string;
    token: string;
    name: string;
    avatar: string;
    contact: string;
    walletId?: string;
    income: number;
    bookings: ObjectId[];
    listings: ObjectId[];
}

export interface ListingEntity {
    _id: ObjectId;
    title: string;
    description: string;
    image: string;
    host: string; // the id of the user
    type: ListingType;
    address: string;
    country: string;
    admin: string;
    city: string;
    bookings: ObjectId[];
    bookingsIndex: BookingsIndex;
    price: number;
    numOfGuests: number;
}

export interface BookingEntity {
    _id: ObjectId;
    listing: ObjectId;
    tenant: string;
    checkIn: string;
    checkOut: string;
}

export interface Database {
    bookings: Collection<BookingEntity>;
    listings: Collection<ListingEntity>;
    users: Collection<UserEntity>;
}

export interface GoogleAuthUrl {
    user: people_v1.Schema$Person;
}

export interface LoginArgs {
    input: LogInInput | null;
}

export interface LogInInput {
    code: string;
}
