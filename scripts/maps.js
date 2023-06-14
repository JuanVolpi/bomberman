import { Entity, SpriteSheetHandler } from "./entities.js";
import { gameState } from "./main.js";
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

  update() {
    return undefined;
  }

  async loadSpritesAsync() {
    return undefined;
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} value
   */
  externMapUpdateGameObjects(x, y, value) {
    this.gameObjects[y][x] = value;
  }

  /**
   * @param {Entity} entity
   */
  entityCheckGameObjectsColision(entity) {
    let posX = entity.hitbox.x;
    let posY = entity.hitbox.y;
    if (entity.movement.sx > 0) {
      posX = Math.max(0, posX + 1);
    } else if (entity.movement.sx < 0) {
      posX = Math.max(0, posX - 1);
    }

    if (entity.movement.sy > 0) {
      posY = Math.min(posY + 1, 14);
    } else if (entity.movement.sy < 0) {
      posY = Math.max(0, posY - 1);
    }

    /**
     * @type {MapElement}
     */
    let pos = this.parsedGameMap[posY][posX];
    /**
     * @type {number}
     */
    let gmObj = this.gameObjects[posY][posX];

    const objTypeCheck = (obj) => obj === 1;
    const barrierGameObjectCheck = this.gameObjects[posY][posX] === 4;

    if (
      (pos !== undefined && objTypeCheck(pos.type)) ||
      (gmObj !== undefined && barrierGameObjectCheck)
    ) {
      if (entity.movement.sy < 0) entity.movement.sy += 6;

      if (entity.movement.sy > 0)
        if (pos.y - entity.movement.y <= 10) entity.movement.sy -= 3.5;

      if (entity.movement.sx < 0)
        if (entity.movement.x - pos.x < 36) entity.movement.sx += 8;
      if (entity.movement.sx > 0) entity.movement.sx -= 3.5;
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
      }
    }
    for (let i = 0; i < this.gameMap.length; i++) {
      for (let j = 0; j < this.gameMap[i].length; j++) {
        if (this.gameObjects[i][j] !== undefined) {
          this.mapSprites
            .get(this.gameObjects[i][j])[0]
            .drawSprite(ctx, j * 60, i * 60, 0.5, 0.5);
        }
      }
    }
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
    this.gameObjects = [];

    for (let i = 0; i < this.gameMap.length; i++) {
      this.gameObjects.push([]);
      for (let j = 0; j < this.gameMap[i].length; j++) {
        this.gameObjects[i].push(undefined);
      }
    }

    this.placeGameObjects();

    this.sprites = "/assets/images/sprites/GameAssets.png";
    this.spriteData = "/assets/images/sprites/GameAssets.json";

    this.mapSprites = new Map();
    this.shs = new SpriteSheetHandler(this.sprites, this.spriteData);
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} value
   */
  externMapUpdateGameObjects(x, y, value) {
    this.gameObjects[y][x] = value;
  }

  handleDestructions() {
    for (const destruction of gameState.destructions) {
      console.log(destruction);
      for (const desct of destruction) {
        if (this.gameObjects[desct[1]][desct[0]] === 4) {
          this.gameObjects[desct[1]][desct[0]] = 2;
          gameState.score += 5;
        }
      }
      gameState.destructions.splice(0, 1);
    }
  }

  placeGameObjects() {
    // Exit object
    this.gameObjects[12][13] = 8;

    // Breakable blocks
    this.gameObjects[3][3] = 4;
    this.gameObjects[5][3] = 4;
    this.gameObjects[6][3] = 4;
    this.gameObjects[6][4] = 4;

    this.gameObjects[2][6] = 4;
    this.gameObjects[3][6] = 4;
    this.gameObjects[4][6] = 4;

    this.gameObjects[2][13] = 4;
    this.gameObjects[2][11] = 4;
    this.gameObjects[2][10] = 4;

    this.gameObjects[6][12] = 4;
    this.gameObjects[7][10] = 4;
    this.gameObjects[8][10] = 4;
    this.gameObjects[8][11] = 4;

    this.gameObjects[9][2] = 4;
    this.gameObjects[9][3] = 4;
    this.gameObjects[9][5] = 4;
    this.gameObjects[9][7] = 4;
    this.gameObjects[9][9] = 4;

    this.gameObjects[10][6] = 4;
    this.gameObjects[11][6] = 4;
    this.gameObjects[12][6] = 4;
    this.gameObjects[12][5] = 4;
    this.gameObjects[12][2] = 4;
    this.gameObjects[12][1] = 4;

    this.gameObjects[4][11] = 4;
    this.gameObjects[5][10] = 4;
    this.gameObjects[5][13] = 4;
    this.gameObjects[6][13] = 4;
    this.gameObjects[8][13] = 4;
    this.gameObjects[9][13] = 4;
    this.gameObjects[10][13] = 4;

    this.gameObjects[10][13] = 4;
    this.gameObjects[10][11] = 4;
    this.gameObjects[11][11] = 4;
    this.gameObjects[11][12] = 4;
    this.gameObjects[11][13] = 4;

    this.gameObjects[13][1] = 11;
    this.gameObjects[8][1] = 11;
    this.gameObjects[3][12] = 11;

    // this.gameObjects[8][1] = { enabled: false };
    // this.gameObjects[13][1] = { enabled: false };
    // this.gameObjects[3][12] = { enabled: false };
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
    this.mapSprites.set(8, this.shs.spriteLoader(GAME_ASSETS.doorLocked));
    this.mapSprites.set(9, this.shs.spriteLoader(GAME_ASSETS.doorUnlocked));
    this.mapSprites.set(10, this.shs.spriteLoader(GAME_ASSETS.doorOpen));
    this.mapSprites.set(11, this.shs.spriteLoader(GAME_ASSETS.controlPanelOff));
    this.mapSprites.set(12, this.shs.spriteLoader(GAME_ASSETS.controlPanelOn));
  }
}
