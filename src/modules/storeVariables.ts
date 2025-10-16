import Store from 'electron-store';
import { Provider } from '../renderer/tabs/Tab4';

const STORE = new Store();

const defaultValues = {
  update_progress: true,
  autoplay_next: true,
  dubbed: false,
  source_flag: 'ZORO',
  subtitle_language: 'English',
  intro_skip_time: 85,
  key_press_skip: 5,
  show_duration: true,
  trailer_volume_on: false,
  volume: 1,
  episodes_per_page: 30,
  history: { entries: {} },
  provider_match_cache: {},
  adult_content: true,
  light_mode: false,
  subtitle_font_family: 'Arial',
  subtitle_font_size: 100,
  subtitle_color: '#FFFFFF',
  subtitle_opacity: 100,
  subtitle_background_color: '#000000',
  subtitle_background_opacity: 75,
  subtitle_outline_color: '#000000',
  subtitle_outline_size: 2,
  subtitle_position: 10,
  preferred_quality: -1,
};

export const setDefaultStoreVariables = () => {
  for (const [key, value] of Object.entries(defaultValues)) {
    if (STORE.has(key)) continue;
    STORE.set(key, value);
  }
};

export const getSourceFlag = async (): Promise<Provider | null> => {
  switch (STORE.get('source_flag')) {
    case 'ZORO': {
      return 'ZORO';
    }
    default: {
      return 'ZORO';
    }
  }
};

export const getProviderSearchMatch = (
  anilistId: number,
  provider: Provider,
  dubbed: boolean,
): any | null => {
  const cache = STORE.get('provider_match_cache', {}) as any;
  const key = `${anilistId}-${provider}-${dubbed}`;

  console.log(key);
  console.log(cache[key]);

  const cachedValue = cache[key];

  if (!cachedValue || !cachedValue.id) {
    return null;
  }

  return cachedValue;
};

/**
 *
 * used for the provider matches caching
 *
 * first 3 params make the id
 * pattern: anilistId-provider-dubbed
 * @param anilistId
 * @param provider
 * @param dubbed
 *
 * result from the provider
 * @param choice
 * @returns
 */
export const setProviderSearchMatch = (
  anilistId: number,
  provider: Provider,
  dubbed: boolean,
  choice: any,
) => {
  const cache = STORE.get('provider_match_cache', {}) as any;
  const key = `${anilistId}-${provider}-${dubbed}`;
  const value = {
    id: choice.id,
    title: choice.title,
    image: choice.image,
  };

  cache[key] = {
    ...cache[key],
    ...value,
  };

  STORE.set('provider_match_cache', cache);
};
