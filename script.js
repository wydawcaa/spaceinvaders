const STAR_COUNT = 150;
const STAR_MIN_SIZE_PX = 1;
const STAR_MAX_SIZE_PX = 4;
const MAX_ANIMATION_DELAY_S = 3;

// Stałe gry
const PLAYER_SPEED = 2.5;
const PLAYER_WIDTH = 60;

// Stan gry
let gameActive = false;
let playerX = 0;
let keysPressed = {};
let gameCanvas = null;
let playerShip = null;
let canvasWidth = 0;

function createStars() {
  const starsContainer = document.getElementById("stars");
  if (!starsContainer) {
    console.error("Nie znaleziono kontenera na gwiazdy (#stars).");
    return;
  }

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement("div");
    star.className = "star";

    const size = Math.random() * (STAR_MAX_SIZE_PX - STAR_MIN_SIZE_PX) + STAR_MIN_SIZE_PX;
    const sizeInPixels = `${size}px`;

    star.style.width = sizeInPixels;
    star.style.height = sizeInPixels;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * MAX_ANIMATION_DELAY_S}s`;

    fragment.appendChild(star);
  }

  starsContainer.appendChild(fragment);
}

function createPlayerShip() {
  const ship = document.createElement("div");
  ship.className = "player-ship";
  ship.innerHTML = `
    <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <polygon points="30,10 20,50 30,45 40,50" fill="#00ff88" stroke="#00ccff" stroke-width="2"/>
      <polygon points="20,50 10,55 15,50" fill="#00ff88" stroke="#00ccff" stroke-width="1.5"/>
      <polygon points="40,50 50,55 45,50" fill="#00ff88" stroke="#00ccff" stroke-width="1.5"/>
      <ellipse cx="30" cy="25" rx="6" ry="10" fill="#00ccff" opacity="0.8"/>
      <rect x="24" y="45" width="3" height="8" fill="#ff6b6b" opacity="0.9"/>
      <rect x="33" y="45" width="3" height="8" fill="#ff6b6b" opacity="0.9"/>
      <circle cx="20" cy="35" r="2" fill="#00ccff"/>
      <circle cx="40" cy="35" r="2" fill="#00ccff"/>
    </svg>
  `;
  
  gameCanvas.appendChild(ship);
  return ship;
}

function updatePlayerPosition() {
  if (!gameActive || !playerShip) return;

  if (keysPressed['a'] || keysPressed['A']) playerX -= PLAYER_SPEED;
  if (keysPressed['d'] || keysPressed['D']) playerX += PLAYER_SPEED;

  playerX = Math.max(0, Math.min(playerX, canvasWidth - PLAYER_WIDTH));

  playerShip.style.left = `${playerX}px`;
}

function gameLoop() {
  if (!gameActive) return;

  updatePlayerPosition();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  const playButton = document.getElementById("playButton");
  playButton.classList.add("hidden");

  gameActive = true;
  gameCanvas = document.getElementById("gameCanvas");
  canvasWidth = gameCanvas.offsetWidth;

  playerX = (canvasWidth - PLAYER_WIDTH) / 2;

  playerShip = createPlayerShip();
  playerShip.style.left = `${playerX}px`;

  gameLoop();
}

function handleKeyDown(e) {
  keysPressed[e.key] = true;
}

function handleKeyUp(e) {
  keysPressed[e.key] = false;
}

function initializeApp() {
  createStars();

  const playButton = document.getElementById("playButton");
  if (playButton) playButton.addEventListener("click", startGame);

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
}

document.addEventListener("DOMContentLoaded", initializeApp);
