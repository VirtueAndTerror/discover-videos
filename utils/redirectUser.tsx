import { verifyToken } from '../lib/utils';

const useRedirectUser = async (ctx) => {
  try {
    const token = ctx.req ? ctx.req.cookies?.token : null;
    const userId = await verifyToken(token);
    return {
      userId,
      token,
    };
  } catch (ex) {
    console.log(ex.message, ex);
  }
};

export default useRedirectUser;
