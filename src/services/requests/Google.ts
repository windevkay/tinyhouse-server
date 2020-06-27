import { google } from 'googleapis';
import { GoogleAuthUrl } from '../../lib/types';

//configure google oauth object
const auth = new google.auth.OAuth2(
    process.env.G_CLIENT_ID,
    process.env.G_CLIENT_SECRET,
    `${process.env.PUBLIC_URL}/login`,
);

export const Google = {
    authUrlRequest: auth.generateAuthUrl({
        access_type: 'online',
        scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
    }),
    logInRequest: async (code: string): Promise<GoogleAuthUrl> => {
        const { tokens } = await auth.getToken(code);

        auth.setCredentials(tokens);

        const { data } = await google.people({ version: 'v1', auth }).people.get({
            resourceName: 'people/me',
            personFields: 'emailAddress,names,photos',
        });

        return { user: data };
    },
};
