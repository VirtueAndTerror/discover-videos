import { verifyToken } from '../../lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  findVideoIdByUser,
  updateStats,
  insertStats,
} from '../../lib/db/hasura';

export default async function stats(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { token } = req.cookies;
  if (!token) return res.status(403).send('Forbidden');

  const { videoId } = method === 'POST' ? req.body : req.query;

  try {
    if (videoId) {
      const userId = await verifyToken(token);
      const findVideo = await findVideoIdByUser(token, userId, videoId);
      const doesStatsExist = findVideo?.length > 0;

      switch (method) {
        case 'GET':
          if (doesStatsExist) {
            res.send(findVideo);
          } else {
            res.status(404).send({ user: null, msg: 'Video not found' });
          }
          break;
        case 'POST':
          const { watched = true, favorited } = req.body;

          if (doesStatsExist) {
            // update it
            const response = await updateStats(token, {
              watched,
              userId,
              videoId,
              favorited,
            });
            res.send({ data: response });
          } else {
            //create it
            const response = await insertStats(token, {
              watched,
              userId,
              videoId,
              favorited,
            });
            res.send({ data: response });
          }
          break;
        default:
          res.status(405).send('405 Method Not Allowed');
      }
    } else {
      res.status(400).send({ msg: 'No videoId provided' });
    }
  } catch (ex) {
    console.error('Error occurred /api/stats', ex);
    res.status(500).send({ done: false, error: ex.message });
  }
}
