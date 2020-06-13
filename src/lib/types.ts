//Types for MongoDB
import { Collection } from 'mongodb';
import { ListingEntity } from '../types/types';

export interface Database {
    listings: Collection<ListingEntity>;
}
