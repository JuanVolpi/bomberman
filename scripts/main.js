import { parseSecondsToDateString } from "./utils.js";

const GAME_SECTION_ID = Object.freeze("app");

const gameState = {
  canvasContext: undefined,
  gameMapEntities: {},
  gameEntities: {},
  wonState: false,
  score: 0,
  time: 0,
  gameTimerId: null,
  canvasSize: { width: undefined, height: undefined },
};

/**
 *  Create the game canvas with a given height and width
 * @returns {HTMLCanvasElement}
 */
function createGameCanvas() {
  const canvas = document.createElement("canvas");

  canvas.setAttribute("id", "canvas");
  gameState.canvasContext = canvas.getContext("2d");
  canvas.style.backgroundColor = "white";

  return canvas;
}

/**
 * @returns {HTMLCanvasElement}
 */
function getCanvasElement() {
  return document.getElementById("canvas");
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

function startGame() {
  gameState.gameTimerId = setInterval(function () {
    gameState.time += 1;
    updateScreenGameInformation();
  }, 1000);
}

function stopGame() {
  clearInterval(gameState.gameTimerId);
}

function resetGame() {
  clearInterval(gameState.gameTimerId);
  gameState.gameTimerId = null;
  gameState.time = 0;
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
    stopButton.setAttribute("disabled", true);
    startButton.setAttribute("disabled", false);
  };
  document.getElementById("reset_button").onclick = function (event) {
    event.preventDefault();
    resetGame();
    resetButton.setAttribute("disabled", true);
  };
}

function init() {
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
