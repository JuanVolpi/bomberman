/**
 *
 * @param {CanvasRenderingContext2D} ctx
 */
export async function drawImageIntoCanvasTEST(ctx) {
  const sprites = "/assets/images/sprites/GameAssetssprite.png";
  const spriteData = "/assets/images/sprites/GameAssets.json";

  const shs = new SpriteSheet(sprites, spriteData);
  await shs.loadSpriteSheetDataAsync();
  const sprite = new Sprite(
    shs.spriteSheet,
    "Objects/DoorLocked.png",
    shs.spriteInformation("Objects/DoorLocked.png"),
  );

  sprite.drawSprite(ctx, 10, 10, 0.8, 0.8);
}

const EntityState = Object.freeze({
  INERT: Symbol("inert"),
  PLAYING: Symbol("playing"),
  DEAD: Symbol("dead"),
  PAUSED: Symbol("paused"),
});

class Entity {
  state = EntityState.INERT;
  position = {
    x: 0,
    y: 0,
  };
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
  constructor(spriteSheet, name, frame) {
    this.spriteSheet = spriteSheet;
    this.name = name;
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
