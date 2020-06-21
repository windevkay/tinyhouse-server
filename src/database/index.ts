import { MongoClient } from 'mongodb';

import { Database } from '../lib/types';
import { ListingEntity, UserEntity, BookingEntity } from '../types/types';

const user = process.env.DB_USER;
const userPassword = process.env.DB_USER_PASSWORD;
const cluster = process.env.DB_CLUSTER;

const url = `mongodb+srv://${user}:${userPassword}@${cluster}.mongodb.net/<dbname>?retryWrites=true&w=majority`;

export const connectDatabase = async (): Promise<Database> => {
    try {
        const client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const db = client.db('main');

        return {
            bookings: db.collection<BookingEntity>('bookings'),
            listings: db.collection<ListingEntity>('listings'),
            users: db.collection<UserEntity>('users'),
        };
    } catch (error) {
        return Promise.reject('could not establish connection to mongodb');
    }
};
