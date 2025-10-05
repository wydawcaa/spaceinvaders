// Przechowywanie liczb w stałych sprawia, że kod jest
// łatwiejszy do zrozumienia i modyfikacji w przyszłości.
const STAR_COUNT = 150;
const STAR_MIN_SIZE_PX = 1;
const STAR_MAX_SIZE_PX = 4;
const MAX_ANIMATION_DELAY_S = 3;

function createStars() {
  const starsContainer = document.getElementById("stars");

  //  Sprawdzamy, czy kontener istnieje,
  // aby uniknąć błędów, jeśli ktoś zmieni HTML.
  if (!starsContainer) {
    console.error("Nie znaleziono kontenera na gwiazdy (#stars).");
    return;
  }

  // Używamy DocumentFragment, aby uniknąć wielokrotnego przerysowywania strony.
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement("div");
    star.className = "star";

    const size =
      Math.random() * (STAR_MAX_SIZE_PX - STAR_MIN_SIZE_PX) + STAR_MIN_SIZE_PX;
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

/**
 * Funkcja wywoływana po kliknięciu przycisku "Play".
 */
function startGame() {
  console.log("Gra rozpoczęta!");
  alert("Gra zostanie uruchomiona w przyszłej wersji!");
  // W przyszłości ta funkcja zainicjuje logikę gry.
}

// Główny punkt wejścia aplikacji. Kod jest uruchamiany dopiero po
// załadowaniu całego drzewa DOM, co zapobiega błędom.

function initializeApp() {
  createStars();

  const playButton = document.getElementById("play-button");

  //dodajemy event listener tylko jeśli przycisk istnieje.
  if (playButton) {
    playButton.addEventListener("click", startGame);
  } else {
    console.error("Nie znaleziono przycisku startu gry (#play-button).");
  }
}

document.addEventListener("DOMContentLoaded", initializeApp);
