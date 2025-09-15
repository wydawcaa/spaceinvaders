// Generowanie losowych gwiazd
function createStars() {
  const starsContainer = document.getElementById("stars");
  const numStars = 100;

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    star.className = "star";

    // Losowe pozycjonowanie
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";

    // Losowy rozmiar
    const size = Math.random() * 3 + 1;
    star.style.width = size + "px";
    star.style.height = size + "px";

    // Losowe opóźnienie animacji
    star.style.animationDelay = Math.random() * 3 + "s";

    starsContainer.appendChild(star);
  }
}

// Inicjalizacja gwiazd po załadowaniu strony
window.addEventListener("load", createStars);

// Funkcja startowania gry
function startGame() {
  console.log("Gra rozpoczęta!");
  // Tutaj później dodasz logikę rozpoczęcia gry
  alert("Gra zostanie uruchomiona w przyszłej wersji!");
}

// Podstawowa interakcja - later będziesz mógł to rozwinąć
/*
        document.addEventListener('keydown', function(e) {
            if (e.code === 'Space') {
                e.preventDefault();
                console.log('Strzał!');
                // Tutaj później dodasz logikę strzelania
            }
            
            if (e.code === 'ArrowLeft') {
                console.log('Ruch w lewo');
                // Tutaj później dodasz ruch statku w lewo
            }
            
            if (e.code === 'ArrowRight') {
                console.log('Ruch w prawo');
                // Tutaj później dodasz ruch statku w prawo
            }
        });
        */
