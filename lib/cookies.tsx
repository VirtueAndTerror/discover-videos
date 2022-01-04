import cookie, { CookieSerializeOptions } from 'cookie';
import { NextApiResponse } from 'next';

const MAX_AGE = 7 * 24 * 60 * 60;

const opts: CookieSerializeOptions = {
  maxAge: MAX_AGE,
  expires: new Date(Date.now() + MAX_AGE * 1000),
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

export const setTokenCookie = (token: string, res: NextApiResponse): void => {
  const setCookie = cookie.serialize('token', token, opts);
  res.setHeader('Set-Cookie', setCookie);
};

export const removeTokenCookie = (res: NextApiResponse) => {
  const value = cookie.serialize('token', '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', value);
};
