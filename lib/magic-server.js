import { Magic } from '@magic-sdk/admin';

const SECRET_API_KEY = process.env.MAGIC_SERVER_KEY;

export const mAdmin = new Magic(SECRET_API_KEY); // ✨
