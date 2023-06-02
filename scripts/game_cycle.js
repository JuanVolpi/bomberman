import { Player } from "./entities.js";
import { gameState } from "./main.js";
import { GameMap } from "./maps.js";

const FRAME_RATE = 1000 / 20;

/**
 * @param {Player} player
 * @param {GameMap} gameMap
 */
export function TESTGameCycle(player, gameMap) {
  let index = 0;
  let last;
  const doIt = function (step) {
    // if (last === undefined) {
    //   last = step;
    // }
    // const elapsed = step - last;
    // if (elapsed < FRAME_RATE) return;
    // last = step;

    gameState.canvasContext.clearRect(
      0,
      0,
      gameState.canvasSize.width,
      gameState.canvasSize.height,
    );
    gameMap.render(gameState.canvasContext);
    player.gameElement.behave(gameState.canvasContext);
    player.handleMovement();

    setTimeout(doIt, FRAME_RATE);
  };
  doIt();
}
