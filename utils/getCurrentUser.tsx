import { verifyToken } from '../lib/utils';

const getCurrentUser = async (ctx) => {
  try {
    const token = ctx.req ? ctx.req.cookies?.token : null;
    const userId = await verifyToken(token);
    return {
      userId,
      token,
    };
  } catch (ex) {
    console.error(ex.message, ex);
  }
};

export default getCurrentUser;
