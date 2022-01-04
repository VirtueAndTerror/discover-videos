import { mAdmin } from '../../lib/magic-server';
import { removeTokenCookie } from '../../lib/cookies';
import { verifyToken } from '../../lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!req.cookies.token)
      return res.status(401).json({ msg: 'User is not logged in' });
    const token = req.cookies.token;

    const userId = await verifyToken(token);
    removeTokenCookie(res);

    try {
      await mAdmin.users.logoutByIssuer(userId);
    } catch (ex) {
      console.error('Error occurred while logging out magic user', ex);
    }

    res.redirect(302, '/');
  } catch (ex) {
    console.error({ ex });
    res.status(401).json({ msg: 'user is not logged in' });
  }
}
