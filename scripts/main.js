import { drawImageIntoCanvasTEST } from "./classes.js";
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
  const canvas = document.getElementById("canvas");

  const game_section = document.getElementById(GAME_SECTION_ID);

  const styleWidth = window
    .getComputedStyle(game_section)
    .width.replace("px", "");
  const styleHeight = window
    .getComputedStyle(game_section)
    .height.replace("px", "");

  let sizes = {
    w: Number(styleWidth) * 0.9 + "px",
    h: Number(styleHeight) * 0.78 + "px",
  };

  canvas.setAttribute("width", sizes.w);
  canvas.setAttribute("height", sizes.h);

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
  gameState.score = 0;
  updateScreenGameInformation();
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

  await drawImageIntoCanvasTEST(gameState.canvasContext);
}

window.onload = init();
