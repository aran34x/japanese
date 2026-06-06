import { SUPABASE_URL } from './supabase-config';

const COIN_IMAGE_BUCKET = 'deck-media';
const COIN_IMAGE_PREFIX = 'characters';

export function coinImageUrl(filename: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${COIN_IMAGE_BUCKET}/${COIN_IMAGE_PREFIX}/${filename}`;
}

export function localCoinImageUrl(filename: string) {
  return `/assets/characters/${filename}`;
}

export function coinImage(filename: string) {
  return {
    imageUrl: coinImageUrl(filename),
    fallbackImageUrl: localCoinImageUrl(filename)
  };
}
