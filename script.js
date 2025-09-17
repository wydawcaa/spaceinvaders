function createStars() {
  const starsContainer = document.getElementById("stars");
  const numStars = 100;

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    star.className = "star";

    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";

    const size = Math.random() * 3 + 1;
    star.style.width = size + "px";
    star.style.height = size + "px";

    star.style.animationDelay = Math.random() * 3 + "s";

    starsContainer.appendChild(star);
  }
}

window.addEventListener("load", createStars);

function startGame() {
  console.log("Gra rozpoczęta!");

  alert("Gra zostanie uruchomiona w przyszłej wersji!");
}
