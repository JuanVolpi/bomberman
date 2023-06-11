import { Entity, SpriteSheetHandler } from "./entities.js";
import { GAME_ASSETS } from "./sprite_lists.js";

/**
 * @typedef {{type: number, x: number, y: number}} MapElement
 */

export class GameMap {
  constructor() {
    this.gameBGMap = undefined;
    this.gameMap = undefined;
    this.gameObjects = undefined;
    this.parsedGameMap = undefined;
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
    let posX = entity.hitbox.x;
    let posY = entity.hitbox.y;
    if (entity.movement.sx > 0) {
      posX += 1;
    } else if (entity.movement.sx < 0) {
      posX -= 1;
    }

    if (entity.movement.sy > 0) {
      posY += 1;
    } else if (entity.movement.sy < 0) {
      posY -= 1;
    }

    /**
     * @type {MapElement}
     */
    let pos = this.parsedGameMap[posY][posX];

    // console.table(this.parsedGameMap[entity.hitbox.y][entity.hitbox.x]);

    if (pos !== undefined && pos.type === 1) {
      if (entity.movement.sy < 0) {
        console.log("@@");
        entity.movement.sy += 5.7;
      }
      if (entity.movement.sy > 0) {
        if (pos.y - entity.movement.y <= 10) {
          entity.movement.sy -= 3.5;
        }
      }

      if (entity.movement.sx < 0) {
        if (entity.movement.x - pos.x <= 35) {
          entity.movement.sx += 6;
        }
      }
      if (entity.movement.sx > 0) {
        entity.movement.sx -= 3.5;
      }
    }
  }

  parseGameMap() {
    let map = [];
    for (let i = 0; i < this.gameMap.length; i++) {
      map.push(new Array(15));
      for (let j = 0; j < this.gameMap[i].length; j++) {
        let multiplier = 60;
        let multiplierX = j * multiplier;
        let multiplierY = i * multiplier - 120;
        map[i][j] = {
          type: this.gameMap[i][j],
          x: multiplierX,
          y: multiplierY,
        };
      }
    }
    return map;
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
    this.parsedGameMap = this.parseGameMap();
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
