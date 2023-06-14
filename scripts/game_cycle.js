import { Player } from "./entities.js";
import { gameState } from "./main.js";
import { GameMap } from "./maps.js";

const FRAME_RATE = 1000 / 20;

/**
 * @param {Player} player
 * @param {GameMap} gameMap
 */
export function TESTGameCycle(player, gameMap) {
  gameState.gameObjectiveMap = gameMap.gameObjects;
  gameState.gameMapChange = gameMap.externMapUpdateGameObjects;

  const doIt = function (step) {
    if (!gameState.running) return;

    gameState.canvasContext.clearRect(
      0,
      0,
      gameState.canvasSize.width,
      gameState.canvasSize.height,
    );
    gameMap.render(gameState.canvasContext);

    player.gameElement.behave(gameState.canvasContext);
    player.handleMovement();

    for (let i = 0; i < gameState.gameMapEntities.length; ++i) {
      if (gameState.gameMapEntities[i].state === "dead") {
        gameState.gameMapEntities.splice(i, 1);
      }
      if (gameState.gameMapEntities[i] !== undefined)
        gameState.gameMapEntities[i].behave(gameState.canvasContext);
    }

    gameMap.entityMapBoundsCheck(player.gameElement);
    gameMap.entityCheckGameObjectsColision(player.gameElement);
    gameMap.handleDestructions();

    setTimeout(doIt, FRAME_RATE);
  };
  doIt();
}
