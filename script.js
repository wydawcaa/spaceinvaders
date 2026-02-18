// ==================== CONSTANTS ====================
const STAR_COUNT = 150;
const STAR_MIN_SIZE_PX = 1;
const STAR_MAX_SIZE_PX = 4;
const MAX_ANIMATION_DELAY_S = 3;

// Base game constants
const PLAYER_SPEED_BASE = 2.5;
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 60;
const BULLET_SPEED = 5;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 15;
const ENEMY_SPEED_BASE = 0.8;
const ENEMY_WIDTH = 50;
const ENEMY_HEIGHT = 40;
const ENEMY_SPAWN_INTERVAL_BASE = 2000;
const ENEMY_BULLET_SPEED = 3;
const ENEMY_BULLET_WIDTH = 4;
const ENEMY_BULLET_HEIGHT = 12;
const ENEMY_SHOOT_CHANCE = 0.0008; // per frame per enemy
const HITS_PER_LIFE = 2; // how many hits one heart absorbs

const MAX_LIVES = 3;
const POWERUP_DROP_CHANCE = 0.3; // 30% chance on enemy kill
const POWERUP_SPEED = 1.5;
const POWERUP_WIDTH = 30;
const POWERUP_HEIGHT = 30;
const POWERUP_DURATION = 8000; // ms
const SHIELD_FLASH_DURATION = 1500; // ms

// ==================== GAME STATE ====================
let gameActive = false;
let hitPoints = 0; // current hit points within a life
let playerX = 0;
let playerSpeed = PLAYER_SPEED_BASE;
let keysPressed = {};
let gameCanvas = null;
let playerShip = null;
let canvasWidth = 0;
let canvasHeight = 0;
let bullets = [];
let enemies = [];
let enemyBullets = [];
let powerups = [];
let enemySpawnTimer = null;
let score = 0;
let highScore = parseInt(localStorage.getItem('spaceInvadersHighScore')) || 0;
let lives = MAX_LIVES;
let hasShield = false;
let hasDoubleFire = false;
let hasSpeedBoost = false;
let activePowerupTimers = [];
let shootCooldown = false;
let currentEnemySpeed = ENEMY_SPEED_BASE;
let currentSpawnInterval = ENEMY_SPAWN_INTERVAL_BASE;

// ==================== AUDIO (Web Audio API) ====================
let audioCtx = null;

function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playSound(type) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  const now = audioCtx.currentTime;

  switch (type) {
    case 'shoot':
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    case 'explosion':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    case 'hit':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
      break;
    case 'gameover':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.8);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.start(now);
      osc.stop(now + 0.8);
      break;
    case 'powerup':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, now);
      osc.frequency.setValueAtTime(659, now + 0.08);
      osc.frequency.setValueAtTime(784, now + 0.16);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    case 'loseLife':
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.5);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
      break;
  }
}

// ==================== STARS ====================
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

// ==================== PLAYER ====================
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

// ==================== BULLETS ====================
function createBullet(x, y) {
  const bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.left = `${x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2}px`;
  bullet.style.bottom = `${y}px`;
  gameCanvas.appendChild(bullet);
  bullets.push({ element: bullet, x: x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2, y: y });
}

function shootBullet() {
  if (!gameActive || shootCooldown) return;
  initAudio();
  playSound('shoot');
  const shipBottom = 20;
  const shipHeight = 60;

  if (hasDoubleFire) {
    // Two bullets offset to left and right
    createBullet(playerX - 8, shipBottom + shipHeight);
    createBullet(playerX + 8, shipBottom + shipHeight);
  } else {
    createBullet(playerX, shipBottom + shipHeight);
  }

  shootCooldown = true;
  setTimeout(() => { shootCooldown = false; }, 150);
}

// ==================== ENEMY TYPES ====================
const ENEMY_TYPES = {
  normal: {
    speedMult: 1,
    hp: 1,
    points: 10,
    color: '#ff6b6b',
    stroke: '#ff4444',
    eyeColor: '#ff9b4a',
    svg: (c, s, e) => `
      <svg viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="25" cy="20" rx="20" ry="15" fill="${c}" stroke="${s}" stroke-width="2"/>
        <circle cx="18" cy="18" r="4" fill="#fff"/><circle cx="32" cy="18" r="4" fill="#fff"/>
        <circle cx="18" cy="18" r="2" fill="#000"/><circle cx="32" cy="18" r="2" fill="#000"/>
        <line x1="15" y1="8" x2="12" y2="2" stroke="${c}" stroke-width="2"/>
        <line x1="35" y1="8" x2="38" y2="2" stroke="${c}" stroke-width="2"/>
        <circle cx="12" cy="2" r="2" fill="${e}"/><circle cx="38" cy="2" r="2" fill="${e}"/>
      </svg>`
  },
  fast: {
    speedMult: 2.2,
    hp: 1,
    points: 15,
    color: '#ffdd57',
    stroke: '#f0c020',
    eyeColor: '#fff740',
    svg: (c, s, e) => `
      <svg viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg">
        <polygon points="25,5 5,35 45,35" fill="${c}" stroke="${s}" stroke-width="2"/>
        <circle cx="20" cy="25" r="3" fill="#fff"/><circle cx="30" cy="25" r="3" fill="#fff"/>
        <circle cx="20" cy="25" r="1.5" fill="#000"/><circle cx="30" cy="25" r="1.5" fill="#000"/>
        <line x1="10" y1="35" x2="5" y2="40" stroke="${e}" stroke-width="2"/>
        <line x1="40" y1="35" x2="45" y2="40" stroke="${e}" stroke-width="2"/>
      </svg>`
  },
  tank: {
    speedMult: 0.5,
    hp: 3,
    points: 30,
    color: '#c084fc',
    stroke: '#9333ea',
    eyeColor: '#e879f9',
    svg: (c, s, e) => `
      <svg viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="40" height="30" rx="6" fill="${c}" stroke="${s}" stroke-width="2"/>
        <circle cx="18" cy="18" r="5" fill="#fff"/><circle cx="32" cy="18" r="5" fill="#fff"/>
        <circle cx="18" cy="18" r="2.5" fill="#000"/><circle cx="32" cy="18" r="2.5" fill="#000"/>
        <rect x="10" y="30" width="8" height="6" rx="2" fill="${e}"/>
        <rect x="32" y="30" width="8" height="6" rx="2" fill="${e}"/>
        <line x1="22" y1="27" x2="28" y2="27" stroke="${s}" stroke-width="2"/>
      </svg>`
  },
  zigzag: {
    speedMult: 1,
    hp: 1,
    points: 20,
    color: '#34d399',
    stroke: '#059669',
    eyeColor: '#6ee7b7',
    zigzag: true,
    svg: (c, s, e) => `
      <svg viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M25,5 L45,20 L25,35 L5,20 Z" fill="${c}" stroke="${s}" stroke-width="2"/>
        <circle cx="20" cy="18" r="3" fill="#fff"/><circle cx="30" cy="18" r="3" fill="#fff"/>
        <circle cx="20" cy="18" r="1.5" fill="#000"/><circle cx="30" cy="18" r="1.5" fill="#000"/>
        <circle cx="25" cy="28" r="2" fill="${e}"/>
      </svg>`
  }
};

function getRandomEnemyType() {
  const r = Math.random();
  if (r < 0.4) return 'normal';
  if (r < 0.6) return 'fast';
  if (r < 0.8) return 'tank';
  return 'zigzag';
}

function createEnemy() {
  const typeName = getRandomEnemyType();
  const type = ENEMY_TYPES[typeName];
  const enemy = document.createElement("div");
  enemy.className = `enemy enemy-${typeName}`;
  enemy.innerHTML = type.svg(type.color, type.stroke, type.eyeColor);

  const x = Math.random() * (canvasWidth - ENEMY_WIDTH);
  enemy.style.left = `${x}px`;
  enemy.style.top = `0px`;
  gameCanvas.appendChild(enemy);

  enemies.push({
    element: enemy,
    x: x,
    y: 0,
    hp: type.hp,
    type: typeName,
    speedMult: type.speedMult,
    points: type.points,
    zigzagPhase: Math.random() * Math.PI * 2,
    zigzag: type.zigzag || false
  });
}

// ==================== ENEMY BULLETS ====================
function createEnemyBullet(x, y) {
  const bullet = document.createElement("div");
  bullet.className = "enemy-bullet";
  bullet.style.left = `${x}px`;
  bullet.style.top = `${y}px`;
  gameCanvas.appendChild(bullet);
  enemyBullets.push({ element: bullet, x: x, y: y });
}

// ==================== POWER-UPS ====================
const POWERUP_TYPES = ['doubleFire', 'shield', 'speedBoost'];
const POWERUP_ICONS = {
  doubleFire: { label: '⚡', className: 'powerup-double' },
  shield: { label: '🛡', className: 'powerup-shield' },
  speedBoost: { label: '💨', className: 'powerup-speed' }
};

function createPowerup(x, y) {
  const typeName = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
  const info = POWERUP_ICONS[typeName];
  const el = document.createElement("div");
  el.className = `powerup ${info.className}`;
  el.textContent = info.label;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  gameCanvas.appendChild(el);
  powerups.push({ element: el, x, y, type: typeName });
}

function activatePowerup(type) {
  playSound('powerup');
  const statusEl = document.getElementById('powerupStatus');

  switch (type) {
    case 'doubleFire':
      hasDoubleFire = true;
      showPowerupIndicator('⚡ Double Fire');
      const dfTimer = setTimeout(() => { hasDoubleFire = false; hidePowerupIndicator('doubleFire'); }, POWERUP_DURATION);
      activePowerupTimers.push(dfTimer);
      break;
    case 'shield':
      hasShield = true;
      if (playerShip) playerShip.classList.add('shielded');
      showPowerupIndicator('🛡 Shield');
      const shTimer = setTimeout(() => {
        hasShield = false;
        if (playerShip) playerShip.classList.remove('shielded');
        hidePowerupIndicator('shield');
      }, POWERUP_DURATION);
      activePowerupTimers.push(shTimer);
      break;
    case 'speedBoost':
      hasSpeedBoost = true;
      playerSpeed = PLAYER_SPEED_BASE * 1.8;
      showPowerupIndicator('💨 Speed');
      const sbTimer = setTimeout(() => {
        hasSpeedBoost = false;
        playerSpeed = PLAYER_SPEED_BASE;
        hidePowerupIndicator('speedBoost');
      }, POWERUP_DURATION);
      activePowerupTimers.push(sbTimer);
      break;
  }
}

function showPowerupIndicator(text) {
  const container = document.getElementById('powerupIndicators');
  const el = document.createElement('div');
  el.className = 'powerup-indicator';
  el.textContent = text;
  el.dataset.type = text;
  container.appendChild(el);
}

function hidePowerupIndicator(type) {
  const container = document.getElementById('powerupIndicators');
  // Remove first matching (approximate match by content)
  const children = container.children;
  for (let i = 0; i < children.length; i++) {
    if (children[i].textContent.toLowerCase().includes(type.substring(0, 4).toLowerCase())) {
      children[i].remove();
      break;
    }
  }
}

// ==================== EXPLOSIONS ====================
function createExplosion(x, y) {
  const explosion = document.createElement("div");
  explosion.className = "explosion";
  explosion.style.left = `${x - 5}px`;
  explosion.style.top = `${y - 10}px`;
  gameCanvas.appendChild(explosion);
  setTimeout(() => explosion.remove(), 500);
}

// ==================== COLLISION DETECTION ====================
function rectsOverlap(a, b) {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

function checkBulletEnemyCollision(bullet, enemy) {
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
  return rectsOverlap(bulletRect, enemyRect);
}

function checkEnemyBulletPlayerCollision(eb) {
  const ebRect = {
    left: eb.x,
    right: eb.x + ENEMY_BULLET_WIDTH,
    top: eb.y,
    bottom: eb.y + ENEMY_BULLET_HEIGHT
  };
  const playerRect = {
    left: playerX,
    right: playerX + PLAYER_WIDTH,
    top: canvasHeight - 20 - PLAYER_HEIGHT,
    bottom: canvasHeight - 20
  };
  return rectsOverlap(ebRect, playerRect);
}

function checkPowerupPlayerCollision(pu) {
  const puRect = {
    left: pu.x,
    right: pu.x + POWERUP_WIDTH,
    top: pu.y,
    bottom: pu.y + POWERUP_HEIGHT
  };
  const playerRect = {
    left: playerX,
    right: playerX + PLAYER_WIDTH,
    top: canvasHeight - 20 - PLAYER_HEIGHT,
    bottom: canvasHeight - 20
  };
  return rectsOverlap(puRect, playerRect);
}

// ==================== DIFFICULTY SCALING ====================
function getDifficultyMultiplier() {
  // Every 50 points, difficulty increases
  return 1 + (score / 50) * 0.15;
}

function updateDifficulty() {
  const mult = getDifficultyMultiplier();
  currentEnemySpeed = ENEMY_SPEED_BASE * mult;
  const newInterval = Math.max(500, ENEMY_SPAWN_INTERVAL_BASE / mult);

  if (Math.abs(newInterval - currentSpawnInterval) > 100) {
    currentSpawnInterval = newInterval;
    if (enemySpawnTimer) {
      clearInterval(enemySpawnTimer);
      enemySpawnTimer = setInterval(() => { if (gameActive) createEnemy(); }, currentSpawnInterval);
    }
  }
}

// ==================== UPDATE LOOPS ====================
function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.y += BULLET_SPEED;
    bullet.element.style.bottom = `${bullet.y}px`;
    if (bullet.y > canvasHeight) { bullet.element.remove(); bullets.splice(i, 1); }
  }
}

function updateEnemyBullets() {
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const eb = enemyBullets[i];
    eb.y += ENEMY_BULLET_SPEED;
    eb.element.style.top = `${eb.y}px`;

    if (eb.y > canvasHeight) {
      eb.element.remove();
      enemyBullets.splice(i, 1);
      continue;
    }

    if (checkEnemyBulletPlayerCollision(eb)) {
      eb.element.remove();
      enemyBullets.splice(i, 1);
      playerHit();
    }
  }
}

function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.y += currentEnemySpeed * enemy.speedMult;

    // Zigzag movement
    if (enemy.zigzag) {
      enemy.zigzagPhase += 0.05;
      enemy.x += Math.sin(enemy.zigzagPhase) * 2;
      enemy.x = Math.max(0, Math.min(enemy.x, canvasWidth - ENEMY_WIDTH));
      enemy.element.style.left = `${enemy.x}px`;
    }

    enemy.element.style.top = `${enemy.y}px`;

    // Enemy shooting
    if (Math.random() < ENEMY_SHOOT_CHANCE) {
      createEnemyBullet(enemy.x + ENEMY_WIDTH / 2 - ENEMY_BULLET_WIDTH / 2, enemy.y + ENEMY_HEIGHT);
    }

    // Bullet-enemy collision
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (checkBulletEnemyCollision(bullets[j], enemy)) {
        bullets[j].element.remove();
        bullets.splice(j, 1);
        enemy.hp--;

        if (enemy.hp <= 0) {
          createExplosion(enemy.x + ENEMY_WIDTH / 2, enemy.y + ENEMY_HEIGHT / 2);
          playSound('explosion');
          enemy.element.remove();
          enemies.splice(i, 1);
          score += enemy.points;
          updateScore();
          updateDifficulty();

          // Chance to drop power-up
          if (Math.random() < POWERUP_DROP_CHANCE) {
            createPowerup(enemy.x + ENEMY_WIDTH / 2 - POWERUP_WIDTH / 2, enemy.y);
          }
        } else {
          // Flash the enemy to show it was hit
          enemy.element.classList.add('enemy-hit');
          setTimeout(() => enemy.element.classList.remove('enemy-hit'), 150);
          playSound('hit');
        }
        break;
      }
    }

    // Enemy passed screen → lose life
    if (enemies[i] && enemies[i].y > canvasHeight) {
      enemies[i].element.remove();
      enemies.splice(i, 1);
      loseLife();
    }
  }
}

function updatePowerups() {
  for (let i = powerups.length - 1; i >= 0; i--) {
    const pu = powerups[i];
    pu.y += POWERUP_SPEED;
    pu.element.style.top = `${pu.y}px`;

    if (pu.y > canvasHeight) {
      pu.element.remove();
      powerups.splice(i, 1);
      continue;
    }

    if (checkPowerupPlayerCollision(pu)) {
      activatePowerup(pu.type);
      pu.element.remove();
      powerups.splice(i, 1);
    }
  }
}

// ==================== LIVES / HIT SYSTEM ====================
function playerHit() {
  if (hasShield) {
    hasShield = false;
    if (playerShip) playerShip.classList.remove('shielded');
    hidePowerupIndicator('shield');
    playSound('hit');
    if (playerShip) {
      playerShip.classList.add('shield-break');
      setTimeout(() => playerShip && playerShip.classList.remove('shield-break'), SHIELD_FLASH_DURATION);
    }
    return;
  }
  hitPoints++;
  playSound('hit');
  if (playerShip) {
    playerShip.classList.add('player-hit');
    setTimeout(() => playerShip && playerShip.classList.remove('player-hit'), 400);
  }
  if (hitPoints >= HITS_PER_LIFE) {
    hitPoints = 0;
    loseLife();
  }
}

function loseLife() {
  lives--;
  hitPoints = 0;
  playSound('loseLife');
  updateLivesDisplay();

  if (lives <= 0) {
    gameOver();
  } else {
    if (playerShip) {
      playerShip.classList.add('player-hit');
      setTimeout(() => playerShip && playerShip.classList.remove('player-hit'), 800);
    }
  }
}

function updateLivesDisplay() {
  const livesEl = document.getElementById('livesDisplay');
  if (livesEl) {
    livesEl.innerHTML = '❤️'.repeat(Math.max(0, lives));
  }
}

// ==================== SCORE / HIGH SCORE ====================
function updateScore() {
  const scoreDisplay = document.getElementById("scoreDisplay");
  if (scoreDisplay) scoreDisplay.textContent = `Score: ${score}`;

  // Update high score in real-time
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('spaceInvadersHighScore', highScore);
  }
  updateHighScoreDisplay();
}

function updateHighScoreDisplay() {
  const hsEl = document.getElementById('highScoreDisplay');
  if (hsEl) hsEl.textContent = `Best: ${highScore}`;
}

// ==================== PLAYER MOVEMENT ====================
function updatePlayerPosition() {
  if (!gameActive || !playerShip) return;
  if (keysPressed['a'] || keysPressed['A'] || keysPressed['ArrowLeft']) playerX -= playerSpeed;
  if (keysPressed['d'] || keysPressed['D'] || keysPressed['ArrowRight']) playerX += playerSpeed;
  playerX = Math.max(0, Math.min(playerX, canvasWidth - PLAYER_WIDTH));
  playerShip.style.left = `${playerX}px`;
}

// ==================== SPAWN ====================
function startEnemySpawning() {
  currentSpawnInterval = ENEMY_SPAWN_INTERVAL_BASE;
  enemySpawnTimer = setInterval(() => { if (gameActive) createEnemy(); }, currentSpawnInterval);
}

// ==================== GAME LOOP ====================
function gameLoop() {
  if (!gameActive) return;
  updatePlayerPosition();
  updateBullets();
  updateEnemyBullets();
  updateEnemies();
  updatePowerups();
  requestAnimationFrame(gameLoop);
}

// ==================== GAME OVER ====================
function gameOver() {
  gameActive = false;
  playSound('gameover');
  if (enemySpawnTimer) { clearInterval(enemySpawnTimer); enemySpawnTimer = null; }

  // Save high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('spaceInvadersHighScore', highScore);
  }

  const overlay = document.getElementById("gameOverOverlay");
  document.getElementById("finalScore").textContent = `Score: ${score}`;
  document.getElementById("finalHighScore").textContent = `Best: ${highScore}`;
  overlay.classList.add("active");
}

// ==================== START / RESTART ====================
function startGame() {
  initAudio();
  document.getElementById("playButton").classList.add("hidden");
  document.getElementById("scoreDisplay").style.display = "block";
  document.getElementById("livesDisplay").style.display = "block";
  document.getElementById("highScoreDisplay").style.display = "block";
  document.getElementById("powerupIndicators").style.display = "flex";

  gameActive = true;
  gameCanvas = document.getElementById("gameCanvas");
  canvasWidth = gameCanvas.offsetWidth;
  canvasHeight = gameCanvas.offsetHeight;
  score = 0;
  lives = MAX_LIVES;
  playerSpeed = PLAYER_SPEED_BASE;
  hasShield = false;
  hasDoubleFire = false;
  hasSpeedBoost = false;
  currentEnemySpeed = ENEMY_SPEED_BASE;
  shootCooldown = false;
  hitPoints = 0;

  updateScore();
  updateLivesDisplay();
  updateHighScoreDisplay();

  playerX = (canvasWidth - PLAYER_WIDTH) / 2;
  playerShip = createPlayerShip();
  playerShip.style.left = `${playerX}px`;
  startEnemySpawning();
  gameLoop();
}

function restartGame() {
  // Clear timers
  activePowerupTimers.forEach(t => clearTimeout(t));
  activePowerupTimers = [];

  // Remove all game objects from DOM
  bullets.forEach(b => b.element.remove());
  enemies.forEach(e => e.element.remove());
  enemyBullets.forEach(eb => eb.element.remove());
  powerups.forEach(p => p.element.remove());
  bullets = [];
  enemies = [];
  enemyBullets = [];
  powerups = [];
  if (playerShip) { playerShip.remove(); playerShip = null; }

  document.querySelectorAll(".explosion").forEach(e => e.remove());

  // Hide overlay + UI, show play button
  document.getElementById("gameOverOverlay").classList.remove("active");
  document.getElementById("scoreDisplay").style.display = "none";
  document.getElementById("livesDisplay").style.display = "none";
  document.getElementById("highScoreDisplay").style.display = "none";
  document.getElementById("powerupIndicators").style.display = "none";
  document.getElementById("powerupIndicators").innerHTML = "";
  document.getElementById("playButton").classList.remove("hidden");

  score = 0;
  lives = MAX_LIVES;
  keysPressed = {};
}

// ==================== INPUT ====================
function handleKeyDown(e) {
  keysPressed[e.key] = true;
  if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); shootBullet(); }
}

function handleKeyUp(e) { keysPressed[e.key] = false; }

// ==================== INIT ====================
function initializeApp() {
  createStars();
  // Load high score
  highScore = parseInt(localStorage.getItem('spaceInvadersHighScore')) || 0;

  document.getElementById("playButton")?.addEventListener("click", startGame);
  document.getElementById("restartButton")?.addEventListener("click", restartGame);
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
}

document.addEventListener("DOMContentLoaded", initializeApp);
