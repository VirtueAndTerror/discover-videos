import { mAdmin } from '../../lib/magic-server';
import jwt from 'jsonwebtoken';
import { isNewUser, createNewUser } from '../../lib/db/hasura';
import { setTokenCookie } from '../../lib/cookies';

export default async function login(req, res) {
  if (req.method !== 'POST')
    return res
      .status(405)
      .send({ done: false, message: '405 Method Not Allowed' });

  try {
    const auth = req.headers.authorization;
    const didToken = auth ? auth.substr(7) : '';

    const metadata = await mAdmin.users.getMetadataByToken(didToken);

    const token = jwt.sign(
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

    const isNewUserQuery = await isNewUser(token, metadata.issuer);
    isNewUserQuery && (await createNewUser(token, metadata));
    setTokenCookie(token, res);
    res.send({ done: true });
  } catch (ex) {
    console.error('Something went wrong logging in', ex);
    res.status(500).send({ done: false });
  }
}
