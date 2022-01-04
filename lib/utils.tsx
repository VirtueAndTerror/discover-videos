import jwt from 'jsonwebtoken';

export async function verifyToken(token: string): Promise<null | string> {
  if (!token) return null;

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as any;
  const userId = decodedToken?.issuer;

  return userId;
}
