import { setupPlayerEntity } from "./entities.js";
import { TESTGameCycle } from "./game_cycle.js";
import { Map1 } from "./maps.js";
import { parseSecondsToDateString } from "./utils.js";

const GAME_SECTION_ID = Object.freeze("app");

export let gameState = {
  canvasContext: undefined,
  gameObjectiveMap: [],
  gameMapEntities: [],
  gameEntities: [],
  gameMapChange: undefined,
  destructions: [],
  switchEnabled: 0,
  wonState: false,
  score: 0,
  time: 0,
  power: 2,
  running: false,
  gameTimerId: null,
  canvasSize: { width: undefined, height: undefined },
};

function resetGameState() {
  gameState = {
    gameObjectiveMap: [],
    gameMapEntities: [],
    gameEntities: [],
    destructions: [],
    wonState: false,
    score: 0,
    time: 0,
    power: 2,
    running: false,
    gameTimerId: null,
    ...gameState,
  };
}

/**
 *  Create the game canvas with a given height and width
 * @returns {HTMLCanvasElement}
 */
function createGameCanvas() {
  const canvas = document.getElementById("canvas");

  canvas.setAttribute("id", "canvas");
  gameState.canvasContext = canvas.getContext("2d");

  return canvas;
}

/**
 * Returns the page section were the canvas should be built
 * @returns {HTMLCanvasElement}
 */
function getMainGameSection() {
  return document.getElementById(GAME_SECTION_ID);
}

function updateScreenGameInformation() {
  document.getElementById("game_score").innerText = " " + gameState.score;
  document.getElementById("game_time").innerText =
    " " + parseSecondsToDateString(gameState.time);
}

async function startGame() {
  gameState.gameTimerId = setInterval(function () {
    gameState.time += 1;
    updateScreenGameInformation();
  }, 1000);
  const robo = await setupPlayerEntity(gameState.canvasContext);
  const map = new Map1();
  await map.loadSpritesAsync();

  gameState.running = true;

  TESTGameCycle(robo, map);
}

function stopGame() {
  gameState.running = false;
  clearInterval(gameState.gameTimerId);
}

function resetGame() {
  gameState.running = false;
  resetGameState();
  clearInterval(gameState.gameTimerId);
  gameState.gameTimerId = null;
  gameState.time = 0;
  gameState.score = 0;
  updateScreenGameInformation();
  startGame();
}

/**
 * Add appropriate events too each game control button
 */
function addGameControlButtonEvents() {
  const startButton = document.getElementById("start_button");
  const stopButton = document.getElementById("stop_button");
  const resetButton = document.getElementById("reset_button");

  startButton.onclick = function (event) {
    event.preventDefault();
    startGame();
    startButton.setAttribute("disabled", true);
  };
  stopButton.onclick = function (event) {
    event.preventDefault();
    stopGame();
    stopButton.removeAttribute("disabled");
    startButton.removeAttribute("disabled");
  };
  document.getElementById("reset_button").onclick = function (event) {
    event.preventDefault();
    resetGame();
    // resetButton.setAttribute("disabled", false);
    startButton.removeAttribute("disabled");
    stopButton.removeAttribute("disabled");
  };
}

async function init() {
  //   document.documentElement.requestFullscreen();

  updateScreenGameInformation();
  addGameControlButtonEvents();

  const gameCanvas = createGameCanvas();
  gameState.canvasSize = {
    width: gameCanvas.width,
    height: gameCanvas.height,
  };

  getMainGameSection().appendChild(gameCanvas);
}

window.onload = init();
