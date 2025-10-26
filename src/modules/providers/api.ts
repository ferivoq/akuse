import 'dotenv/config';

import Store from 'electron-store';
import { ipcRenderer } from 'electron';

import { ListAnimeData } from '../../types/anilistAPITypes';
import { animeCustomTitles } from '../animeCustomTitles';
import { getParsedAnimeTitles } from '../utils';
import axios from 'axios';

const STORE = new Store();

export const searchInProvider = async (query: string) => {
  const lang = (await STORE.get('source_flag')) as string;
  const dubbed = (await STORE.get('dubbed')) as boolean;

  switch (lang) {
    case 'ZORO': {
      return await ipcRenderer.invoke('consumet:search', 'zoro', query);
    }
  }

  return null;
};

export const searchAutomaticMatchInProvider = async (
  listAnimeData: ListAnimeData,
  episode: number,
) => {
  const lang = (await STORE.get('source_flag')) as string;
  const dubbed = (await STORE.get('dubbed')) as boolean;

  // build custom titles
  const customTitle =
    animeCustomTitles[lang] &&
    animeCustomTitles[lang][listAnimeData.media?.id!];
  const animeTitles = getParsedAnimeTitles(listAnimeData.media);
  if (customTitle) animeTitles.unshift(customTitle.title);

  console.log(
    '[API] searchAutomaticMatchInProvider - lang:',
    lang,
    'dubbed:',
    dubbed,
    'animeTitles:',
    animeTitles,
  );

  switch (lang) {
    case 'ZORO': {
      console.log(
        '[Renderer] Calling consumet:search for zoro with title:',
        animeTitles[0],
      );
      const results = await ipcRenderer.invoke(
        'consumet:search',
        'zoro',
        animeTitles[0],
      );
      console.log('[Renderer] consumet:search returned:', results);
      return results && results.length > 0 ? results : null;
    }
  }

  return null;
};

export const getSourceFromProvider = async (
  providerAnimeId: string,
  episode: number,
) => {
  const lang = (await STORE.get('source_flag')) as string;
  const dubbed = (await STORE.get('dubbed')) as boolean;

  switch (lang) {
    case 'ZORO': {
      console.log('[Renderer] Fetching anime info for zoro:', providerAnimeId);
      const animeInfo = await ipcRenderer.invoke(
        'consumet:fetchInfo',
        'zoro',
        providerAnimeId,
      );

      if (!animeInfo || !animeInfo.episodes) {
        console.error('[Renderer] No episodes found in anime info');
        return null;
      }

      const episodeData = animeInfo.episodes.find(
        (ep: any) => ep.number === episode,
      );
      if (!episodeData) {
        console.error(`[Renderer] Episode ${episode} not found`);
        return null;
      }

      console.log('[Renderer] Found episode:', episodeData.id);
      return await ipcRenderer.invoke(
        'consumet:fetchEpisodeSources',
        'zoro',
        episodeData.id,
      );
    }
  }

  return null;
};

export const apiRequest = async (url: string) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'x-api-key': process.env.SOFAMAXXING_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
