import axios from 'axios';

const CONSUMET_API_BASE = 'https://hoso-api.vercel.app';

export async function searchAnime(
  provider: 'zoro',
  query: string,
  dubbed: boolean = false,
) {
  try {
    console.log(
      `[Consumet] Searching ${provider} for: ${query}, dubbed: ${dubbed}`,
    );
    const url = `${CONSUMET_API_BASE}/anime/${provider}/${encodeURIComponent(query)}${dubbed ? '?dub=true' : ''}`;
    const response = await axios.get(url);
    return response.data.results || response.data;
  } catch (error: any) {
    console.error(
      `[Consumet] searchAnime failed for ${provider}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
}

export async function fetchAnimeInfo(
  provider: 'zoro',
  id: string,
  dubbed: boolean = false,
) {
  try {
    console.log(
      `[Consumet] Fetching anime info for ${provider}, id: ${id}, dubbed: ${dubbed}`,
    );
    const url = `${CONSUMET_API_BASE}/anime/${provider}/info?id=${encodeURIComponent(id)}${dubbed ? '&dub=true' : ''}`;
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

export async function fetchEpisodeSources(
  provider: 'zoro',
  episodeId: string,
  dubbed: boolean = false,
) {
  try {
    console.log(
      `[Consumet] Fetching episode sources for ${provider}, episodeId: ${episodeId}, dubbed: ${dubbed}`,
    );
    const url = `${CONSUMET_API_BASE}/anime/${provider}/watch/${encodeURIComponent(episodeId)}${dubbed ? '?dub=true' : ''}`;
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
