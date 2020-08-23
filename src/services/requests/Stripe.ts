import stripe from 'stripe';

const client = new stripe(`${process.env.S_SECRET_KEY}`, { apiVersion: '2020-03-02' });

export const Stripe = {
    connect: async (code: string): Promise<stripe.OAuthToken> => {
        const response = await client.oauth.token({
            /** eslint-disable @typescript-eslint/camelcase */
            grant_type: 'authorization_code',
            code,
            /** eslint-enable @typescript-eslint/camelcase */
        });
        return response;
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    charge: async (amount: number, source: string, stripeAccount: string) => {
        const res = await client.charges.create(
            {
                amount,
                currency: 'usd',
                source,
                application_fee_amount: Math.round(amount * 0.05),
            },
            {
                stripe_account: stripeAccount,
            },
        );
        if (res.status !== 'succeeded') {
            throw new Error('failed to create charge with Stripe');
        }
    },
};
