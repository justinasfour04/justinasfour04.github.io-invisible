import ConePng from '../static/img/cone.png';
import Spritesheet from '../static/img/spritesheet.png';
import Background from '../static/img/background.png';
import { loadImage } from './util';
import {
  FRAME_COUNT,
  SPRITE_HEIGHT,
  SPRITE_WIDTH,
  SPRITE_WIDTHS,
} from './constant';

type CacheValue = ImageBitmap | Array<ImageBitmap>;

export enum CacheKey {
  TOP_CONE,
  BOTTOM_CONE,
  BACKGROUND,
  SPRITES,
}

const cache: Map<CacheKey, CacheValue> = new Map();

export default class ImageCache {
  static async loadAllImages(canvas: HTMLCanvasElement) {
    cache.set(CacheKey.TOP_CONE, await loadImage(
      ConePng,
      0,
      0,
      321,
      400,
      {
        resizeQuality: 'high',
        resizeHeight: 100,
      },
    ));

    cache.set(CacheKey.BOTTOM_CONE, await loadImage(
      ConePng,
      0,
      0,
      321,
      400,
      {
        resizeQuality: 'high',
        resizeHeight: 125,
      },
    ));

    cache.set(CacheKey.BACKGROUND, await loadImage(
      Background,
      0,
      0,
      2560,
      706,
      {
        resizeQuality: 'high',
        resizeWidth: canvas.width + 60,
        resizeHeight: 410,
      },
    ));

    cache.set(CacheKey.SPRITES, await Promise.all(
      Array.from(
        { length: FRAME_COUNT },
        (_, i) => loadImage(
          Spritesheet,
          (i % FRAME_COUNT) * SPRITE_WIDTH,
          0,
          SPRITE_WIDTHS[i % FRAME_COUNT],
          SPRITE_HEIGHT,
          {
            resizeQuality: 'high',
            resizeHeight: 250,
          },
        ),
      ),
    ));
  }

  static getImage(key: CacheKey) {
    return cache.get(key);
  }
}