import { SpriteSheetHandler } from "./entities.js";
import { GAME_ASSETS } from "./sprite_lists.js";

export class GameMap {
  render() {
    return null;
  }
  update() {
    return null;
  }
}

export class Map1 extends GameMap {
  constructor() {
    super();

    this.gameBGMap = new Array(15).fill([
      0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
    ]);

    this.gameMap = this.genGameMap();
    this.gameObjects = undefined;

    this.sprites = "/assets/images/sprites/GameAssets.png";
    this.spriteData = "/assets/images/sprites/GameAssets.json";

    this.mapSprites = new Map();
    this.shs = new SpriteSheetHandler(this.sprites, this.spriteData);
  }

  async loadSpritesAsync() {
    await this.shs.loadSpriteSheetDataAsync();
    this.registerSprites();
  }

  registerSprites() {
    this.mapSprites.set(0, this.shs.spriteLoader(GAME_ASSETS.borderTile));
    this.mapSprites.set(1, this.shs.spriteLoader(GAME_ASSETS.box));
    this.mapSprites.set(2, this.shs.spriteLoader(GAME_ASSETS.bgTile));
    this.mapSprites.set(
      3,
      this.shs.spriteLoader(GAME_ASSETS.borderTileVertical),
    );
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  async render(ctx) {
    for (let i = 0; i < this.gameMap.length; i++) {
      for (let j = 0; j < this.gameMap[i].length; j++) {
        this.mapSprites
          .get(this.gameBGMap[i][j])[0]
          .drawSprite(ctx, j * 60, i * 60, 0.5, 0.5);
        this.mapSprites
          .get(this.gameMap[i][j])[0]
          .drawSprite(ctx, j * 60, i * 60, 0.5, 0.5);
      }
    }
  }

  genGameMap() {
    return [
      [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
      [0, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
      [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
      [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
      [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
      [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
      [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
      [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
      [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
      [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
      [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
      [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
      [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
      [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
      [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
    ];
  }
}
