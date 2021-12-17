import videoTestData from '../data/videos.json';

const fetchVideos = async url => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const BASE_URL = 'youtube.googleapis.com/youtube/v3/';

  const API_URL = `https://${BASE_URL}${url}&key=${YOUTUBE_API_KEY}`;

  const response = await fetch(API_URL);

  const data = await response.json();
  return data;
};

export const getCommonVideos = async url => {
  try {
    const isDev = process.env.DEVELOPMENT;

    const data = isDev ? videoTestData : await fetchVideos(url);

    if (data?.error) {
      console.error('YouTube API error', data.error);
      return [];
    }

    return data?.items.map(item => {
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

export const getVideos = searchQuery => {
  const URL = `search?part=snippet&maxResults=25&q=${searchQuery}`;
  return getCommonVideos(URL);
};

export const getPopularVideos = () => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=25&regionCode=US`;

  return getCommonVideos(URL);
};

export const getYoutubeVideoById = videoId => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;

  return getCommonVideos(URL);
};
