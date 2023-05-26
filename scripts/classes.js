/**
 *
 * @param {CanvasRenderingContext2D} ctx
 */
export async function drawImageIntoCanvasTEST(ctx) {
  const sprites = "/assets/images/sprites/GameAssetssprite.png";
  const spriteData = "/assets/images/sprites/GameAssets.json";

  const shs = new SpriteSheet(sprites, spriteData);
  await shs.loadSpriteSheetDataAsync();
  const spriteDoorLocked = new Sprite(
    shs.spriteSheet,
    shs.spriteInformation("Objects/DoorLocked.png"),
  );
  const spriteDoorUnLocked = new Sprite(
    shs.spriteSheet,
    shs.spriteInformation("Objects/DoorUnlocked.png"),
  );
  const spriteDoorOpened = new Sprite(
    shs.spriteSheet,
    shs.spriteInformation("Objects/DoorOpen.png"),
  );

  spriteDoorLocked.drawSprite(ctx, 10, 10, 0.5, 0.5);

  let doorSprites = new Map();
  doorSprites.set("door", [
    spriteDoorLocked,
    spriteDoorUnLocked,
    spriteDoorOpened,
  ]);

  const porta = new Porta(
    EntityState.INERT,
    {
      acl: 0.2,
      sx: 1,
      sy: 1,
      x: 100,
      y: 100,
    },
    doorSprites,
    { scaling: 0.5 },
  );

  porta.drawSprite(ctx, "door", 2);
}

const EntityState = Object.freeze({
  INERT: Symbol("inert"),
  PLAYING: Symbol("playing"),
  DEAD: Symbol("dead"),
  PAUSED: Symbol("paused"),
});

class Entity {
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
   * @param {number} spriteIndex
   */
  drawSprite(cnvsContext, spriteList, spriteIndex) {
    this.sprites
      .get(spriteList)
      [spriteIndex].drawSprite(
        cnvsContext,
        this.movement.x,
        this.movement.y,
        this.imgProps.scaling,
        this.imgProps.scaling,
      );
  }
}

class SpriteSheet {
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
}

class SpriteAnimation {}

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

class Porta extends Entity {}
