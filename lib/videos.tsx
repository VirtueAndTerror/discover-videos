import videoTestData from '../data/videos.json';
import { getWatchedVideos, getMyListVideos } from './db/hasura';

interface Video extends Watched {
  title: string;
  description: string;
  channelTitle: string;
  publishTime: string;
  statistics: { viewCount: number };
}

interface Watched {
  id: string;
  imgUrl: string;
}

const fetchVideos = async (url: string) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const BASE_URL = 'youtube.googleapis.com/youtube/v3/';

  const API_URL = `https://${BASE_URL}${url}&key=${YOUTUBE_API_KEY}`;

  const response = await fetch(API_URL);

  const data = await response.json();
  return data;
};

export const getCommonVideos = async (url: string): Promise<Video[]> => {
  try {
    const isDev = process.env.DEVELOPMENT;

    const data = isDev ? videoTestData : await fetchVideos(url);

    if (data?.error) {
      console.error('YouTube API error', data.error);
      return [];
    }

    return data?.items.map((item: any) => {
      const id = item.id?.videoId || item.id;
      const {
        title,
        description,
        publishedAt: publishTime,
        channelTitle,
        thumbnails,
      } = item.snippet;

      return {
        id,
        title,
        description,
        channelTitle,
        publishTime,
        imgUrl: thumbnails.high.url,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      };
    });
  } catch (ex) {
    console.error(ex.message, ex);
    return [];
  }
};

export const getVideos = (searchQuery: string): Promise<Video[]> => {
  const URL = `search?part=snippet&maxResults=25&q=${searchQuery}`;
  return getCommonVideos(URL);
};

export const getPopularVideos = (): Promise<Video[]> => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=25&regionCode=US`;

  return getCommonVideos(URL);
};

export const getYoutubeVideoById = (videoId: string): Promise<Video[]> => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;

  return getCommonVideos(URL);
};

export const getWatchItAgainVideos = async (
  userId: string,
  token: string
): Promise<Watched[]> => {
  const videos = await getWatchedVideos(userId, token);
  if (videos) {
    return videos?.map((video) => ({
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    }));
  } else {
    return null;
  }
};

export const getMyList = async (
  userId: string,
  token: string
): Promise<Watched[]> => {
  const videos = await getMyListVideos(userId, token);
  return videos?.map((video) => ({
    id: video.videoId,
    imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
  }));
};
