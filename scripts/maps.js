import { Entity, SpriteSheetHandler } from "./entities.js";
import { GAME_ASSETS } from "./sprite_lists.js";

export class GameMap {
  constructor() {
    this.gameBGMap = undefined;
    this.gameMap = undefined;
    this.gameObjects = undefined;
  }

  render() {
    return undefined;
  }
  update() {
    return undefined;
  }

  async loadSpritesAsync() {
    return undefined;
  }

  /**
   * @param {Entity} entity
   */
  entityCheckGameObjectsColision(entity) {
    let pos = this.gameMap[entity.hitbox.y + 0][entity.hitbox.x + 0];

    switch (pos) {
      case 1:
        if (entity.movement.sx !== 0) entity.movement.sx -= 6;
        if (entity.movement.sy !== 0) entity.movement.sy -= 6;
        // entity.movement.y -= 60;
        break;
    }
  }

  /**
   * @param {Entity} entity
   */
  entityMapBoundsCheck(entity) {
    if (entity.movement.x < 34) entity.movement.x = 34;
    else if (entity.movement.x >= 753) entity.movement.x = 753;

    if (entity.movement.y < 0) entity.movement.y = 0;
    else if (entity.movement.y >= 729) entity.movement.y = 729;
  }
}

export class Map1 extends GameMap {
  constructor() {
    super();

    this.gameBGMap = new Array(15).fill([
      0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
    ]);

    this.gameMap = [
      [0, 4, 4, 3, 4, 3, 4, 4, 4, 3, 4, 3, 4, 4, 0],
      [0, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 0],
      [0, 2, 2, 1, 2, 1, 2, 1, 1, 1, 2, 2, 1, 2, 0],
      [0, 2, 2, 7, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 0],
      [0, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 0],
      [0, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 0],
      [0, 1, 1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 0],
      [0, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 0],
      [0, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 0],
      [0, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 0],
      [0, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 0],
      [0, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 0],
      [0, 2, 2, 1, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 0],
      [0, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 2, 0],
      [0, 4, 4, 3, 4, 3, 4, 4, 4, 3, 4, 3, 4, 4, 0],
    ];
    this.gameObjects = new Array(15).fill(new Array(15).fill(undefined));

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
    this.mapSprites.set(4, this.shs.spriteLoader(GAME_ASSETS.bottomBorder));
    this.mapSprites.set(5, this.shs.spriteLoader(GAME_ASSETS.explosionBarrel));
    this.mapSprites.set(6, this.shs.spriteLoader(GAME_ASSETS.acidBarrel));
    this.mapSprites.set(7, this.shs.spriteLoader(GAME_ASSETS.bgTileTwo));
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  async render(ctx) {
    for (let i = 0; i < this.gameMap.length; i++) {
      for (let j = 0; j < this.gameMap[i].length; j++) {
        if (this.gameBGMap[i][j] !== undefined)
          this.mapSprites
            .get(this.gameBGMap[i][j])[0]
            .drawSprite(ctx, j * 60, i * 60, 0.5, 0.5);
        if (this.gameMap[i][j] !== undefined)
          this.mapSprites
            .get(this.gameMap[i][j])[0]
            .drawSprite(ctx, j * 60, i * 60, 0.5, 0.5);
        if (this.gameObjects[i][j] !== undefined) {
          this.mapSprites
            .get(this.gameObjects[i][j])[0]
            .drawSprite(ctx, j * 60, i * 60, 0.5, 0.5);
        }
      }
    }
  }
}
