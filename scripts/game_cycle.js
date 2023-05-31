import { Entity } from "./classes.js";
import { gameState } from "./main.js";

const FRAME_RATE = 1000 / 16;

/**
 * @param {Entity} robo
 */
export function TESTGameCycle(robo) {
  let index = 0;
  let last;
  const doIt = function (step) {
    if (last === undefined) {
      last = step;
    }
    const elapsed = step - last;
    if (elapsed < FRAME_RATE) return;
    last = step;

    gameState.canvasContext.clearRect(
      0,
      0,
      gameState.canvasSize.width,
      gameState.canvasSize.height,
    );
    robo.behave(10, 10, gameState.canvasContext, index++);
  };
  const gameLoogInterval = setInterval(function () {
    window.requestAnimationFrame(doIt);
  }, 0);
}
