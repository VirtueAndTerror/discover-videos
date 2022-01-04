import type { NextApiRequest, NextApiResponse } from 'next';
import { mAdmin } from '../../lib/magic-server';
import jwt from 'jsonwebtoken';
import { isNewUser, createNewUser } from '../../lib/db/hasura';
import { setTokenCookie } from '../../lib/cookies';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).send({ message: '405 Method Not Allowed' });

  try {
    // Strip token form http requests headers
    const auth = req.headers.authorization;
    const didToken = auth ? auth.substring(7) : '';
    // Get Metadata form token
    const metadata = await mAdmin.users.getMetadataByToken(didToken);
    // Create jwt token:
    const jwtToken = jwt.sign(
      {
        ...metadata,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': ['user', 'admin'],
          'x-hasura-default-role': 'user',
          'x-hasura-user-id': `${metadata.issuer}`,
        },
      },
      process.env.JWT_SECRET
    );

    const isNewUserQuery = await isNewUser(jwtToken, metadata.issuer);
    // If it is a new User, then create now user in DB.
    isNewUserQuery && (await createNewUser(jwtToken, metadata));
    // Set Cookie in Browser
    setTokenCookie(jwtToken, res);
    res.send({ authenticated: true, isNewUserQuery });
  } catch (ex) {
    console.error('Something went wrong logging in', ex);
    res.status(500).send({ done: false });
  }
}
