import { ObjectID } from 'mongodb';
export type ListingEntity = {
    _id: ObjectID;
    title: string;
    image: string;
    address: string;
    price: number;
    numOfGuests: number;
    numOfBeds: number;
    numOfBaths: number;
    rating: number;
};
