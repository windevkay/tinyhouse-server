import { Collection, ObjectId, MongoClient } from 'mongodb';
import { people_v1 } from 'googleapis';

export enum ListingType {
    Apartment = 'APARTMENT',
    House = 'HOUSE',
}

export enum ListingsFilter {
    PRICE_LOW_TO_HIGH = 'PRICE_LOW_TO_HIGH',
    PRICE_HIGH_TO_LOW = 'PRICE_HIGH_TO_LOW',
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
    authorized?: boolean;
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
    authorized?: boolean;
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
    client: MongoClient;
}

export interface GoogleAuthUrl {
    user: people_v1.Schema$Person;
}

export interface GoogleGeocodeResult {
    country: string | null;
    admin: string | null;
    city: string | null;
}

export interface LoginArgs {
    input: LogInInput | null;
}

export interface LogInInput {
    code: string;
}

export interface ConnectStripeArgs {
    input: { code: string };
}

export interface UserArgs {
    id: string;
}

export interface UserBookingsArgs {
    limit: number;
    page: number;
}

export interface UserBookingsData {
    total: number;
    result: BookingEntity[];
}

export interface UserListingsArgs {
    limit: number;
    page: number;
}

export interface UserListingsData {
    total: number;
    result: ListingEntity[];
}

export interface ListingArgs {
    id: string;
}

export interface ListingBookingsArgs {
    limit: number;
    page: number;
}

export interface ListingBookingsData {
    total: number;
    result: BookingEntity[];
}

export interface ListingsArgs {
    location: string | null;
    filter: ListingsFilter;
    limit: number;
    page: number;
}

export interface ListingsData {
    region: string | null;
    total: number;
    result: ListingEntity[];
}

export interface ListingsGeocodeQuery {
    country?: string;
    admin?: string;
    city?: string;
}

export interface HostListingInput {
    title: string;
    description: string;
    image: string;
    type: ListingType;
    address: string;
    price: number;
    numOfGuests: number;
}

export interface HostListingArgs {
    input: HostListingInput;
}

export interface CreateBookingInput {
    id: string;
    source: string;
    checkIn: string;
    checkOut: string;
}

export interface CreateBookingArgs {
    input: CreateBookingInput;
}
