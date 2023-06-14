import {
  BOMB_SPRITES,
  DINO_SPRITE_ANIM_LIST,
  FLAME_SPRITES,
  ROBOT_SPRITE_ANIM_LIST,
} from "./sprite_lists.js";

import { gameState } from "./main.js";

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 */
export async function setupPlayerEntity(ctx) {
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
  dinoSprites.set("dead", shsDino.spriteLoader(DINO_SPRITE_ANIM_LIST.dead));

  const robo = new Robot(
    "idle",
    {
      sx: 0,
      sy: 0,
      x: 34,
      y: 10,
    },
    robotSprites,
    { scaling: 0.425 },
  );

  const player = new Player(robo);

  return player;
}

export const BasicEntityStates = Object.freeze({
  IDLE: "idle",
  DEAD: "dead",
  PAUSED: "paused",
  PLAYING: "playing",
});

/**
 * @class Entity
 * @constructor
 * @public
 *
 * @property {EntityState} entiState
 * @property {{x:number,y:number,sx:number,sy:number}} movement
 * @property {Map} sprites
 * @property {{scaling:number}} imgProps
 */
export class Entity {
  /**
   * @param {String} entiState
   * @param {{x:number,y:number,sx:number,sy:number}} movement
   * @param {Map} sprites
   * @param {{scaling:number}} imgProps
   */
  constructor(entiState, movement, sprites, imgProps) {
    this.state = entiState;
    /**
     * @property
     * @type {{x:number,y:number,sx:number,sy:number}}
     */
    this.movement = movement;
    this.sprites = sprites;
    this.imgProps = imgProps;

    /**
     * @property
     * @type {{x:number,y:number}}
     */
    this.hitbox = {
      x: this.translateCords(movement.x),
      y: this.translateCords(movement.y),
    };
  }

  update() {
    return null;
  }
  behave() {
    return null;
  }

  /**
   * @param {number} cord
   */
  translateCords(cord) {
    return Math.floor(cord / 60);
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

export class KeyBoardControler {
  constructor(handleMovement) {
    this.keyCodes = {
      ArrowLeft: 37,
      ArrowUp: 38,
      ArrowDown: 40,
      ArrowRight: 39,
      Space: 32,
      KeyF: 70,
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
      KeyF: "KeyF",
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
      KeyF: false,
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
      this.externalEventHandler();
      this.keyState[event.code] = false;
    }
  }

  printKeyStates() {
    console.table(this.keyState);
  }
}

export class Bomb extends Entity {
  animProps = {
    curFrame: 0,
    explosionLastFrame: 9,
    seqLastFrame: 39,
    flameStart: 12,
    flamePlacementIndex: 0,
  };

  /**
   * @param {number} power
   */
  constructor(power, entiState, movement, sprites, imgProps) {
    super(entiState, movement, sprites, imgProps);
    this.power = power;
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
        this.movement.x - 40,
        this.movement.y - 64,
        this.imgProps.scaling,
        this.imgProps.scaling,
      );
  }

  async update(ctx) {
    if (this.state === "explosion") {
      if (this.animProps.curFrame + 1 < this.animProps.explosionLastFrame) {
        this.drawSprite(ctx, this.state, this.animProps.curFrame++);
      }
    } else if (this.state === "sequence") {
      if (this.animProps.curFrame + 1 < this.animProps.seqLastFrame) {
        this.drawSprite(ctx, this.state, this.animProps.curFrame++);
        if (this.animProps.curFrame === 30) {
          let tempDestructionMask = [];
          for (let i = 0; i <= this.power; i++) {
            gameState.gameMapEntities.push(
              await createTestFlame(
                Math.max(32, (this.hitbox.x + i) * 60 - 30),
                Math.max(10, this.hitbox.y * 60),
                "big",
              ),
            );
            tempDestructionMask.push([
              Math.max(0, this.hitbox.x + i),
              Math.max(0, this.hitbox.y + 1),
            ]);
          }
          for (let j = 0 - (this.power - 1); j < this.power; ++j) {
            gameState.gameMapEntities.push(
              await createTestFlame(
                Math.max(32, (this.hitbox.x + 1) * 60 - 30),
                Math.max(10, (this.hitbox.y + j) * 60),
                "big",
              ),
            );
            tempDestructionMask.push([
              Math.max(0, this.hitbox.x + 1),
              Math.max(0, this.hitbox.y + j + 1),
            ]);
          }
          gameState.destructions.push(tempDestructionMask);
        }
      } else {
        this.state = "dead";
      }
    } else this.drawSprite(ctx, this.state, this.animProps.curFrame++);
  }
  behave(ctx) {
    this.update(ctx);
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
     * @type {KeyBoardControler}
     */
    this.keyBoardHandler = new KeyBoardControler(() => {
      this.checkPlayableInput();
    });

    this.stats = {
      life: 3,
      level: 1,
      bombCount: 4,
      restockId: undefined,
    };

    this.registerEventHandlers([
      {
        name: "keydown",
        handler: (e) => this.keyBoardHandler.keyDownListner(e),
      },
      { name: "keyup", handler: (e) => this.keyBoardHandler.keyUpListner(e) },
    ]);
  }

  /**
   * @param {{name: string, handler: Function}[]} events
   */
  registerEventHandlers(events) {
    for (const eve of events) {
      window.addEventListener(eve.name, (event) => eve.handler(event), {
        capture: true,
      });
    }
  }

  async checkPlayableInput() {
    if (this.keyBoardHandler.keyState.Space) {
      await this.placeBomb();
    }
    if (this.keyBoardHandler.keyState.KeyF) {
      console.log("SSS");
      this.checkDoorControlOperation();
    }
  }

  checkDoorControlOperation() {
    console.log(
      gameState.gameObjectiveMap[this.gameElement.hitbox.y][
        this.gameElement.hitbox.x
      ],
    );
    if (
      gameState.gameObjectiveMap[this.gameElement.hitbox.y][
        this.gameElement.hitbox.x
      ] !== undefined &&
      gameState.gameObjectiveMap[this.gameElement.hitbox.y][
        this.gameElement.hitbox.x
      ] === 11
    ) {
      gameState.score += 12;
      gameState.switchEnabled++;
      gameState.gameMapChange(
        this.gameElement.hitbox.x,
        this.gameElement.hitbox.y,
        12,
      );
      if (gameState.switchEnabled >= 4) {
        console.log("CAN GOO");
      }
    }
    console.log(gameState);
  }

  checkRemainingBombCount() {
    if (this.stats.bombCount <= 0) {
      clearInterval(this.stats.restockId);
      this.stats.restockId = setInterval(() => {
        ++this.stats.bombCount;
        if (this.stats.bombCount === 4) {
          clearInterval(this.stats.restockId);
          this.stats.restockId = undefined;
        }
      }, 1000);
    }
  }

  async placeBomb() {
    if (this.stats.bombCount <= 0) return;
    this.stats.bombCount = Math.max(0, --this.stats.bombCount);
    this.checkRemainingBombCount();

    console.table(this.gameElement.hitbox);

    gameState.gameMapEntities.push(
      await createBomb(
        Math.max(32, this.gameElement.hitbox.x * 60 - 30),
        Math.max(10, this.gameElement.hitbox.y * 60 - 50),
        "sequence",
        gameState.power,
      ),
    );

    if (gameState.score % 20 === 0 && gameState.score >= 20) {
      gameState.power += 1;
    }
  }

  handleMovement() {
    const handleMovementDecelaration = (axisAcceleration) => {
      if (this.gameElement.movement[axisAcceleration] < 0)
        this.gameElement.movement[axisAcceleration] = Math.min(
          this.gameElement.movement[axisAcceleration] + 1,
          0,
        );

      if (this.gameElement.movement[axisAcceleration] > 0)
        this.gameElement.movement[axisAcceleration] = Math.max(
          this.gameElement.movement[axisAcceleration] - 1,
          0,
        );
    };

    const handlePositiveMovementDirection = (
      state,
      axisAcceleration,
      axis,
      entityState,
    ) => {
      if (state) {
        this.gameElement.movement[axisAcceleration] = Math.min(
          6,
          this.gameElement.movement[axisAcceleration] + 1.5,
        );
        this.gameElement.updateState(entityState);
      } else {
        handleMovementDecelaration(axisAcceleration);
      }
      this.gameElement.movement[axis] +=
        this.gameElement.movement[axisAcceleration];
    };

    const handleNegativeMovementDirection = (
      state,
      axisAcceleration,
      axis,
      entityState,
    ) => {
      if (state) {
        this.gameElement.movement[axisAcceleration] = Math.max(
          -6,
          this.gameElement.movement[axisAcceleration] - 1.5,
        );
        this.gameElement.updateState(entityState);
      } else {
        handleMovementDecelaration(axisAcceleration);
      }
      this.gameElement.movement[axis] +=
        this.gameElement.movement[axisAcceleration];
    };

    for (const [action, state] of Object.entries(
      this.keyBoardHandler.keyState,
    )) {
      switch (action) {
        case this.keyBoardHandler.codesAsValues.ArrowUp:
          if (this.gameElement.movement.sx !== 0) break;
          handleNegativeMovementDirection(state, "sy", "y", "run");
          break;
        case this.keyBoardHandler.codesAsValues.ArrowDown:
          if (this.gameElement.movement.sx !== 0) break;
          handlePositiveMovementDirection(state, "sy", "y", "run");
          break;
        case this.keyBoardHandler.codesAsValues.ArrowLeft:
          if (this.gameElement.movement.sy !== 0) break;
          handleNegativeMovementDirection(state, "sx", "x", "runReverse");
          break;
        case this.keyBoardHandler.codesAsValues.ArrowRight:
          if (this.gameElement.movement.sy !== 0) break;
          handlePositiveMovementDirection(state, "sx", "x", "run");
          break;
      }
    }

    if (
      this.gameElement.movement.sx === 0 &&
      this.gameElement.movement.sy === 0
    )
      this.gameElement.updateState("idle");
    else {
      this.gameElement.hitbox.x = this.gameElement.translateCords(
        this.gameElement.movement.x + 30,
      );
      this.gameElement.hitbox.y = this.gameElement.translateCords(
        this.gameElement.movement.y + 100,
      );
    }
  }
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} power
 * @param {"bombOn" | "idle" | "explosion" | "sequence"} state
 * @returns A Bomb element
 */
export async function createBomb(x, y, state, power) {
  const spritesBomb = "/assets/images/sprites/Bomb.png";
  const spriteDataBomb = "/assets/images/sprites/Bomb.json";

  const shsBomb = new SpriteSheetHandler(spritesBomb, spriteDataBomb);
  await shsBomb.loadSpriteSheetDataAsync();

  let bombSprites = new Map();
  bombSprites.set("bombOn", shsBomb.spriteLoader(BOMB_SPRITES.bombOn));
  bombSprites.set("idle", shsBomb.spriteLoader(BOMB_SPRITES.idle));
  bombSprites.set("explosion", shsBomb.spriteLoader(BOMB_SPRITES.explosion));
  bombSprites.set("sequence", shsBomb.spriteLoader(BOMB_SPRITES.sequence));

  return new Bomb(
    power,
    state,
    {
      sx: 0,
      sy: 0,
      x: x,
      y: y,
    },
    bombSprites,
    { scaling: 2 },
  );
}

export class Flame extends Entity {
  animProps = {
    curFrame: 0,
    endFrame: FLAME_SPRITES.bigFlame.length - 20,
  };

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
        this.movement.x + 20,
        this.movement.y + 57,
        this.imgProps.scaling,
        this.imgProps.scaling,
      );
  }

  update(ctx) {
    if (this.animProps.curFrame + 1 > this.animProps.endFrame) {
      this.state = "dead";
      return;
    }
    this.drawSprite(ctx, this.state, this.animProps.curFrame++);
  }
  behave(ctx) {
    this.update(ctx);
  }
}

export async function createTestFlame(x, y, state) {
  const spritesFlame = "/assets/images/sprites/FireBlast.png";
  const spriteDataFlame = "/assets/images/sprites/FireBlast.json";

  const shsFlame = new SpriteSheetHandler(spritesFlame, spriteDataFlame);
  await shsFlame.loadSpriteSheetDataAsync();

  let flamesprites = new Map();
  flamesprites.set("big", shsFlame.spriteLoader(FLAME_SPRITES.bigFlame));

  return new Flame(
    state,
    {
      sx: 0,
      sy: 0,
      x: x,
      y: y,
    },
    flamesprites,
    { scaling: 1.3 },
  );
}
