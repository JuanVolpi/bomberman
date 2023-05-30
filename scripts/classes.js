import { ROBOT_SPRITE_ANIM_LIST } from "./sprite_lists.js";

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 */
export async function drawImageIntoCanvasTEST(ctx) {
  const sprites = "/assets/images/sprites/Robotsprite.png";
  const spriteData = "/assets/images/sprites/Robot.json";

  const shs = new SpriteSheetHandler(sprites, spriteData);
  await shs.loadSpriteSheetDataAsync();

  let robotSprites = new Map();
  robotSprites.set("idle", shs.spriteLoader(ROBOT_SPRITE_ANIM_LIST.idle));
  robotSprites.set("dead", shs.spriteLoader(ROBOT_SPRITE_ANIM_LIST.dead));

  const robo = new Robot(
    EntityState.DEAD,
    {
      acl: 0.2,
      sx: 1,
      sy: 1,
      x: 1,
      y: 1,
    },
    robotSprites,
    { scaling: 0.4 },
  );

  // robo.drawSprite(ctx, "idle", 0);
  return robo;
}

export const EntityState = Object.freeze({
  INERT: "inert",
  IDLE: "idle",
  PLAYING: "playing",
  DEAD: "dead",
  PAUSED: "paused",
});

/**
 * @class
 * @constructor
 * @public
 *
 * @property {EntityState} entiState
 * @property {{x:number,y:number,sx:number,sy:number,acl:number}} movement
 * @property {Map} sprites
 * @property {{scaling:number}} imgProps
 */
export class Entity {
  /**
   * @param {EntityState} entiState
   * @param {{x:number,y:number,sx:number,sy:number,acl:number}} movement
   * @param {Map} sprites
   * @param {{scaling:number}} imgProps
   */
  constructor(entiState, movement, sprites, imgProps) {
    this.state = entiState;
    this.movement = movement;
    this.sprites = sprites;
    this.imgProps = imgProps;
  }
  update() {}
  behave() {
    return null;
  }

  /**
   * @param {CanvasRenderingContext2D} cnvsContext
   * @param {string} spriteList
   * @param {number} spriteIndex
   */
  drawSprite(cnvsContext, spriteList, spriteIndex) {
    this.sprites
      .get(spriteList)
      [spriteIndex % this.sprites.get(spriteList).length].drawSprite(
        cnvsContext,
        this.movement.x,
        this.movement.y,
        this.imgProps.scaling,
        this.imgProps.scaling,
      );
  }
}

export class SpriteSheetHandler {
  /**
   *
   * @param {string} spriteSheetLocation
   * @param {string} spriteSheetDataLocation
   */
  constructor(spriteSheetLocation, spriteSheetDataLocation) {
    this.spriteSheet = new Image();
    this.spriteSheet.src = spriteSheetLocation;

    this.dataLocation = spriteSheetDataLocation;
    this.sheetData = undefined;
  }

  /**
   * Loads the json data for the Spritesheet
   */
  async loadSpriteSheetDataAsync() {
    this.sheetData = await fetch(this.dataLocation)
      .then((contents) => contents.json())
      .then((read) => read.frames)
      .catch((err) => console.error(err));
  }

  /**
   *
   * @param {string} spriteName
   * @returns {{x: number, y:number, w:number, h:number}}
   */
  spriteInformation(spriteName) {
    return this.sheetData[spriteName].frame;
  }

  spriteLoader(spriteNames) {
    const sprites = [];
    for (const name of spriteNames)
      sprites.push(new Sprite(this.spriteSheet, this.spriteInformation(name)));
    return sprites;
  }
}

class Sprite {
  /**
   * @param {string} name
   * @param {{x: number, y:number, w:number, h:number}} frame
   * @param {HTMLImageElement} spriteSheet
   */
  constructor(spriteSheet, frame) {
    this.spriteSheet = spriteSheet;
    this.spriteSource = {
      x: frame.x,
      y: frame.y,
    };
    this.spriteSize = {
      w: frame.w,
      h: frame.h,
    };
  }

  /**
   *
   * @param {CanvasRenderingContext2D} canvasCtx
   * @param {number} x
   * @param {number} y
   * @param {number} wp
   * @param {number} hp
   */
  drawSprite(canvasCtx, x, y, wp, hp) {
    canvasCtx.drawImage(
      this.spriteSheet,
      this.spriteSource.x,
      this.spriteSource.y,
      this.spriteSize.w,
      this.spriteSize.h,
      x,
      y,
      this.spriteSize.w * wp,
      this.spriteSize.h * hp,
    );
  }
}

class Door extends Entity {}
class Robot extends Entity {
  update(ctx, index) {
    this.drawSprite(ctx, this.state.toString(), index);
  }
  behave(x, y, ctx, index) {
    this.movement.x = x;
    this.movement.y = y;
    this.update(ctx, index);
  }
}
