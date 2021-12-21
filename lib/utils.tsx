import jwt from 'jsonwebtoken';

export async function verifyToken(token: string): Promise<string | null> {
  if (token) {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedToken?.issuer;
    return userId;
  }
  return null;
}
