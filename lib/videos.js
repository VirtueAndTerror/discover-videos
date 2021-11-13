import videoData from '../data/videos.json';

export const getCommonVideos = async url => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const BASE_URL = 'youtube.googleapis.com/youtube/v3/';

  const API_URL = `https://${BASE_URL}${url}&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await fetch(API_URL);

    const data = await response.json();

    if (data?.error) throw new Error('Something went wrong with video library');

    return data?.items.map(item => {
      const id = item.id?.videoId || item.id;
      return {
        title: item.snippet.title,
        imgUrl: item.snippet.thumbnails.high.url,
        id,
      };
    });
  } catch (ex) {
    console.error('Sometihng went wrong with video library', ex);
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