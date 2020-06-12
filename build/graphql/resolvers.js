'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.resolvers = void 0;
const listings_1 = require('../listings');
exports.resolvers = {
    Query: {
        listings: () => {
            return listings_1.listings;
        },
    },
    Mutation: {
        deleteListing: (_root, { id }) => {
            for (let i = 0; i < listings_1.listings.length; i++) {
                if (listings_1.listings[i].id === id) {
                    return listings_1.listings.splice(i, 1)[0];
                }
            }
            throw new Error('failed to delete listing');
        },
    },
};
