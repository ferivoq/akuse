import axios from 'axios';

const CONSUMET_API_BASE = 'https://hoso-api.vercel.app';

export async function searchAnime(provider: 'zoro', query: string) {
  try {
    console.log(`[Consumet] Searching ${provider} for: ${query}`);
    const url = `${CONSUMET_API_BASE}/anime/${provider}/${encodeURIComponent(query)}`;
    const response = await axios.get(url);
    console.log(`[Consumet] Search results for ${provider}:`, response.data);
    return response.data.results || response.data;
  } catch (error: any) {
    console.error(
      `[Consumet] searchAnime failed for ${provider}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
}

export async function fetchAnimeInfo(provider: 'zoro', id: string) {
  try {
    console.log(`[Consumet] Fetching anime info for ${provider}, id: ${id}`);
    const url = `${CONSUMET_API_BASE}/anime/${provider}/info?id=${encodeURIComponent(id)}`;
    const response = await axios.get(url);
    console.log(
      `[Consumet] Anime info retrieved, ${response.data.episodes?.length || 0} episodes found`,
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `[Consumet] fetchAnimeInfo failed for ${provider}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
}

export async function fetchEpisodeSources(provider: 'zoro', episodeId: string) {
  try {
    console.log(
      `[Consumet] Fetching episode sources for ${provider}, episodeId: ${episodeId}`,
    );
    const url = `${CONSUMET_API_BASE}/anime/${provider}/watch/${encodeURIComponent(episodeId)}`;
    console.log(`[Consumet] Request URL: ${url}`);
    const response = await axios.get(url);
    console.log(
      `[Consumet] Episode sources retrieved:`,
      response.data.sources?.length || 0,
      'sources found',
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `[Consumet] fetchEpisodeSources failed for ${provider}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
}
