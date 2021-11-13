import { Magic } from 'magic-sdk';

const MAGIC_API_KEY = process.env.NEXT_PUBLIC_MAGIC_API_KEY;

function createMagic() {
  return typeof window !== 'undefined' && new Magic(MAGIC_API_KEY);
}

const magic = createMagic();

export default magic;
