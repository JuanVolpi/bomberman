import {
  DINO_SPRITE_ANIM_LIST,
  ROBOT_SPRITE_ANIM_LIST,
} from "./sprite_lists.js";

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 */
export async function drawImageIntoCanvasTEST(ctx) {
  const sprites = "/assets/images/sprites/Robot.png";
  const spriteData = "/assets/images/sprites/Robot.json";

  const spritesDino = "/assets/images/sprites/Dino.png";
  const spriteDataDino = "/assets/images/sprites/Dino.json";

  const shs = new SpriteSheetHandler(sprites, spriteData);
  await shs.loadSpriteSheetDataAsync();

  const shsDino = new SpriteSheetHandler(spritesDino, spriteDataDino);
  await shsDino.loadSpriteSheetDataAsync();

  let robotSprites = new Map();
  robotSprites.set("idle", shs.spriteLoader(ROBOT_SPRITE_ANIM_LIST.idle));
  robotSprites.set("dead", shs.spriteLoader(ROBOT_SPRITE_ANIM_LIST.dead));
  robotSprites.set("run", shs.spriteLoader(ROBOT_SPRITE_ANIM_LIST.run));
  robotSprites.set(
    "runReverse",
    shs.spriteLoader(ROBOT_SPRITE_ANIM_LIST.runReverse),
  );

  let dinoSprites = new Map();
  // dinoSprites.set("idle", shs.spriteLoader(dino_SPRITE_ANIM_LIST.idle));
  dinoSprites.set("dead", shsDino.spriteLoader(DINO_SPRITE_ANIM_LIST.dead));

  const robo = new Robot(
    "idle",
    {
      acl: 0.2,
      sx: 1,
      sy: 1,
      x: 1,
      y: 1,
    },
    robotSprites,
    { scaling: 0.45 },
  );

  const player = new Player(robo);

  window.addEventListener(
    "keydown",
    function (event) {
      player.mvHandler.keyDownListner(event);
    },
    {
      capture: true,
    },
  );
  window.addEventListener(
    "keyup",
    function (event) {
      player.mvHandler.keyUpListner(event);
    },
    {
      capture: true,
    },
  );

  // robo.drawSprite(ctx, "idle", 0);
  return player;
}

export const BasicEntityStates = Object.freeze({
  IDLE: "idle",
  DEAD: "dead",
  PAUSED: "paused",
  PLAYING: "playing",
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
   * @param {String} entiState
   * @param {{x:number,y:number,sx:number,sy:number,acl:number}} movement
   * @param {Map} sprites
   * @param {{scaling:number}} imgProps
   */
  constructor(entiState, movement, sprites, imgProps) {
    this.state = entiState;
    /**
     * @property
     * @type {{x:number,y:number,sx:number,sy:number,acl:number}}
     */
    this.movement = movement;
    this.sprites = sprites;
    this.imgProps = imgProps;
  }

  update() {}
  behave() {
    return null;
  }

  /**
   * @param {string} state
   */
  updateState(state) {
    this.state = state;
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

  /**
   * Returns a list of sprites based on a list of given names
   * @param {String[]} spriteNames
   * @returns {Sprite[]}
   */
  spriteLoader(spriteNames) {
    return spriteNames.map(
      (name) => new Sprite(this.spriteSheet, this.spriteInformation(name)),
    );
  }
}

export class Sprite {
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

class Robot extends Entity {
  animProps = {
    curFrame: 0,
  };

  update(ctx) {
    this.drawSprite(ctx, this.state.toString(), this.animProps.curFrame++);
  }
  behave(ctx) {
    this.update(ctx);
  }
}

export class MovementControler {
  constructor(handleMovement) {
    this.keyCodes = {
      ArrowLeft: 37,
      ArrowUp: 38,
      ArrowDown: 40,
      ArrowRight: 39,
      Space: 32,
    };

    this.externalEventHandler = handleMovement;

    /**
     * Quick way to ket the code of the keys as the key values
     */
    this.codesToKeys = Object.fromEntries(
      Object.entries(this.keyCodes).map((x) => x.reverse()),
    );

    this.codesAsValues = Object.freeze({
      ArrowLeft: "ArrowLeft",
      ArrowUp: "ArrowUp",
      ArrowDown: "ArrowDown",
      ArrowRight: "ArrowRight",
      Space: "Space",
    });

    /**
     * Every key from keycodes starts with a false value
     */
    this.keyState = {
      ArrowLeft: false,
      ArrowUp: false,
      ArrowDown: false,
      ArrowRight: false,
      Space: false,
    };
  }

  /**
   * Listens for keyboard changes (key down)
   * @param {KeyboardEvent} event
   */
  keyDownListner(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.keyCodes[event.code] !== undefined) {
      this.keyState[event.code] = true;
    }
  }

  /**
   * Listens for keyboard changes (key down)
   * @param {KeyboardEvent} event
   */
  keyUpListner(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.keyCodes[event.code] !== undefined) {
      this.keyState[event.code] = false;
    }
  }

  printKeyStates() {
    console.table(this.keyState);
  }
}

export class Player {
  constructor(gameElement) {
    /**
     * @property
     * @type {Entity}
     */
    this.gameElement = gameElement;
    /**
     * @property
     * @type {MovementControler}
     */
    this.mvHandler = new MovementControler(() => this.handleMovement());
  }

  handleMovement() {
    let moving = 4;
    for (const [action, state] of Object.entries(this.mvHandler.keyState)) {
      switch (action) {
        case this.mvHandler.codesAsValues.ArrowUp: {
          if (state) {
            this.gameElement.movement.y -= 8;
            this.gameElement.updateState("run");
            moving++;
          } else {
            this.gameElement.movement.y -= 0;
            moving--;
          }
          break;
        }
        case this.mvHandler.codesAsValues.ArrowDown:
          if (state) {
            this.gameElement.movement.y += 8;
            this.gameElement.updateState("run");
            moving++;
          } else {
            this.gameElement.movement.y += 0;
            moving--;
          }
          break;
        case this.mvHandler.codesAsValues.ArrowLeft:
          if (state) {
            this.gameElement.movement.x -= 8;
            this.gameElement.updateState("runReverse");
            moving++;
          } else {
            this.gameElement.movement.y += 0;
            moving--;
          }
          break;
        case this.mvHandler.codesAsValues.ArrowRight:
          if (state) {
            this.gameElement.movement.x += 8;
            this.gameElement.updateState("run");
            moving++;
          } else {
            this.gameElement.movement.y += 0;
            moving--;
          }
          break;
      }
    }
    if (
      this.gameElement.movement.x === 0 ||
      this.gameElement.movement.y === 0
    ) {
      this.gameElement.updateState("idle");
    }
    if (moving < 1) {
      this.gameElement.updateState("idle");
    }
  }
}
