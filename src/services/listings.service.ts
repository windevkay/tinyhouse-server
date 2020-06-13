import { ObjectId } from 'mongodb';

import { Database } from '../lib/types';
import { ListingEntity } from '../types/types';

export default class ListingsService {
    /**
     * Return all listings
     * @param params database object
     */
    public queryAllListings = async (params: { db: Database }): Promise<ListingEntity[]> => {
        const { db } = params;
        try {
            const listings: ListingEntity[] = await db.listings.find({}).toArray();
            return Promise.resolve(listings);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    /**
     * Delete a listing
     * @param params database object and document id
     */
    public mutationDeleteListing = async (params: { db: Database; id: string }): Promise<ListingEntity> => {
        const { db, id } = params;
        try {
            const deleteRes = await db.listings.findOneAndDelete({
                _id: new ObjectId(id),
            });

            if (!deleteRes.value) {
                throw new Error('failed to delete listing');
            }

            return Promise.resolve(deleteRes.value);
        } catch (error) {
            return Promise.reject(error);
        }
    };
}
