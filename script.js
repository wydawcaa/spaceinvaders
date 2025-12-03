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
const ENEMY_SPEED = 0.8;
const ENEMY_WIDTH = 50;
const ENEMY_HEIGHT = 40;
const ENEMY_SPAWN_INTERVAL = 2000;

// Stan gry
let gameActive = false;
let playerX = 0;
let keysPressed = {};
let gameCanvas = null;
let playerShip = null;
let canvasWidth = 0;
let canvasHeight = 0;
let bullets = [];
let enemies = [];
let enemySpawnTimer = null;
let score = 0;

function createStars() {
  const starsContainer = document.getElementById("stars");
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

  bullets.push({ element: bullet, x: x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2, y: y });
}

function createEnemy() {
  const enemy = document.createElement("div");
  enemy.className = "enemy";
  enemy.innerHTML = `
    <svg viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="25" cy="20" rx="20" ry="15" fill="#ff6b6b" stroke="#ff4444" stroke-width="2"/>
      <circle cx="18" cy="18" r="4" fill="#fff"/>
      <circle cx="32" cy="18" r="4" fill="#fff"/>
      <circle cx="18" cy="18" r="2" fill="#000"/>
      <circle cx="32" cy="18" r="2" fill="#000"/>
      <line x1="15" y1="8" x2="12" y2="2" stroke="#ff6b6b" stroke-width="2"/>
      <line x1="35" y1="8" x2="38" y2="2" stroke="#ff6b6b" stroke-width="2"/>
      <circle cx="12" cy="2" r="2" fill="#ff9b4a"/>
      <circle cx="38" cy="2" r="2" fill="#ff9b4a"/>
    </svg>
  `;
  const x = Math.random() * (canvasWidth - ENEMY_WIDTH);
  enemy.style.left = `${x}px`;
  enemy.style.top = `0px`;
  gameCanvas.appendChild(enemy);

  enemies.push({ element: enemy, x: x, y: 0 });
}

function createExplosion(x, y) {
  const explosion = document.createElement("div");
  explosion.className = "explosion";
  explosion.style.left = `${x - 5}px`;
  explosion.style.top = `${y - 10}px`;
  gameCanvas.appendChild(explosion);
  setTimeout(() => explosion.remove(), 500);
}

function checkCollision(bullet, enemy) {
  const bulletRect = {
    left: bullet.x,
    right: bullet.x + BULLET_WIDTH,
    top: canvasHeight - bullet.y - BULLET_HEIGHT,
    bottom: canvasHeight - bullet.y
  };
  const enemyRect = {
    left: enemy.x,
    right: enemy.x + ENEMY_WIDTH,
    top: enemy.y,
    bottom: enemy.y + ENEMY_HEIGHT
  };
  return !(bulletRect.right < enemyRect.left || 
           bulletRect.left > enemyRect.right || 
           bulletRect.bottom < enemyRect.top || 
           bulletRect.top > enemyRect.bottom);
}

function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.y += ENEMY_SPEED;
    enemy.element.style.top = `${enemy.y}px`;

    for (let j = bullets.length - 1; j >= 0; j--) {
      if (checkCollision(bullets[j], enemy)) {
        createExplosion(enemy.x + ENEMY_WIDTH/2, enemy.y + ENEMY_HEIGHT/2);
        enemy.element.remove(); enemies.splice(i, 1);
        bullets[j].element.remove(); bullets.splice(j, 1);
        score += 10; updateScore();
        break;
      }
    }

    if (enemy.y > canvasHeight) { enemy.element.remove(); enemies.splice(i, 1); }
  }
}

function updateScore() {
  const scoreDisplay = document.getElementById("scoreDisplay");
  if (scoreDisplay) scoreDisplay.textContent = `Score: ${score}`;
}

function startEnemySpawning() {
  enemySpawnTimer = setInterval(() => { if(gameActive) createEnemy(); }, ENEMY_SPAWN_INTERVAL);
}

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.y += BULLET_SPEED;
    bullet.element.style.bottom = `${bullet.y}px`;
    if (bullet.y > canvasHeight) { bullet.element.remove(); bullets.splice(i, 1); }
  }
}

function shootBullet() {
  if (!gameActive) return;
  const shipBottom = 20; const shipHeight = 60;
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
  updateEnemies();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  document.getElementById("playButton").classList.add("hidden");
  const scoreDisplay = document.getElementById("scoreDisplay");
  scoreDisplay.style.display = "block";

  gameActive = true;
  gameCanvas = document.getElementById("gameCanvas");
  canvasWidth = gameCanvas.offsetWidth;
  canvasHeight = gameCanvas.offsetHeight;
  score = 0; updateScore();
  playerX = (canvasWidth - PLAYER_WIDTH)/2;
  playerShip = createPlayerShip(); playerShip.style.left = `${playerX}px`;
  startEnemySpawning();
  gameLoop();
}

function handleKeyDown(e) {
  keysPressed[e.key] = true;
  if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); shootBullet(); }
}

function handleKeyUp(e) { keysPressed[e.key] = false; }

function initializeApp() {
  createStars();
  document.getElementById("playButton")?.addEventListener("click", startGame);
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
}

document.addEventListener("DOMContentLoaded", initializeApp);
