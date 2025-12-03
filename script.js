const STAR_COUNT = 150;
const STAR_MIN_SIZE_PX = 1;
const STAR_MAX_SIZE_PX = 4;
const MAX_ANIMATION_DELAY_S = 3;

// Stałe gry
const PLAYER_SPEED = 2.5;
const PLAYER_WIDTH = 60;
const BULLET_SPEED = 5;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 15;

// Stan gry
let gameActive = false;
let playerX = 0;
let keysPressed = {};
let gameCanvas = null;
let playerShip = null;
let canvasWidth = 0;
let canvasHeight = 0;
let bullets = [];

function createStars() {
  const starsContainer = document.getElementById("stars");
  if (!starsContainer) return;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement("div");
    star.className = "star";

    const size = Math.random() * (STAR_MAX_SIZE_PX - STAR_MIN_SIZE_PX) + STAR_MIN_SIZE_PX;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
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

function createBullet(x, y) {
  const bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.left = `${x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2}px`;
  bullet.style.bottom = `${y}px`;

  gameCanvas.appendChild(bullet);

  bullets.push({
    element: bullet,
    x: x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
    y: y
  });
}

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.y += BULLET_SPEED;
    bullet.element.style.bottom = `${bullet.y}px`;

    if (bullet.y > canvasHeight) {
      bullet.element.remove();
      bullets.splice(i, 1);
    }
  }
}

function shootBullet() {
  if (!gameActive) return;
  const shipBottom = 20;
  const shipHeight = 60;
  createBullet(playerX, shipBottom + shipHeight);
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
  updateBullets();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  const playButton = document.getElementById("playButton");
  playButton.classList.add("hidden");

  gameActive = true;
  gameCanvas = document.getElementById("gameCanvas");
  canvasWidth = gameCanvas.offsetWidth;
  canvasHeight = gameCanvas.offsetHeight;

  playerX = (canvasWidth - PLAYER_WIDTH) / 2;
  playerShip = createPlayerShip();
  playerShip.style.left = `${playerX}px`;

  gameLoop();
}

function handleKeyDown(e) {
  keysPressed[e.key] = true;
  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault();
    shootBullet();
  }
}

function handleKeyUp(e) {
  keysPressed[e.key] = false;
}

function initializeApp() {
  createStars();
  const playButton = document.getElementById("playButton");
  playButton?.addEventListener("click", startGame);
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
}

document.addEventListener("DOMContentLoaded", initializeApp);
