import { Entity } from "./classes.js";
import { gameState } from "./main.js";

const FRAME_RATE = 1000 / 18;

/**
 *
 * @param {Entity} robo
 */
export function TESTGameCycle(robo) {
  let index = 0;
  const doIt = function (step) {
    gameState.canvasContext.clearRect(
      0,
      0,
      gameState.canvasSize.width,
      gameState.canvasSize.height,
    );
    console.log(`Step: ${step}`);
    robo.behave(10, 10, gameState.canvasContext, index++);
  };
  const gameLoogInterval = setInterval(function () {
    window.requestAnimationFrame(doIt);
  }, FRAME_RATE);
}
