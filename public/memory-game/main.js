console.log("¿SweetAlert2 está disponible?", typeof Swal !== "undefined");
const originalIcons = [
  { src: "/memory-game/images/icon1.png", alt: "icono 1" },
  { src: "/memory-game/images/icon2.png", alt: "icono 2" },
  { src: "/memory-game/images/icon3.png", alt: "icono 3" },
  { src: "/memory-game/images/icon4.png", alt: "icono 4" },
  { src: "/memory-game/images/icon5.png", alt: "icono 5" },
  { src: "/memory-game/images/icon6.png", alt: "icono 6" },
  { src: "/memory-game/images/icon7.png", alt: "icono 7" },
  { src: "/memory-game/images/icon8.png", alt: "icono 8" },
  { src: "/memory-game/images/icon9.png", alt: "icono 9" },
  { src: "/memory-game/images/icon10.png", alt: "icono 10" },
  { src: "/memory-game/images/icon11.png", alt: "icono 11" },
  { src: "/memory-game/images/icon12.png", alt: "icono 12" }
];
// Variables de estado del juego
let selections = [];
let locked = false;
let matches = 0;
let moves = 0;
let time = 0;
let timeInterval = null;
let gameStarted = false;
let gamePaused = false;
let inPreview = false;
//resume game
function togglePause() {
  if (inPreview) return;

  const pauseButton = document.getElementById("pause-button");

  if (!gamePaused) {
    clearInterval(timeInterval);
    gamePaused = true;
    pauseButton.textContent = "Reanudar";
  } else {
    timeInterval = setInterval(() => {
      time++;
      updateStats();
    }, 1000);
    gamePaused = false;
    pauseButton.textContent = "Pausar";
  }
}

// Create card / Crea el HTML de una carta
function createCardHTML(icon, i) {
  const area = document.createElement("div");
  area.className = "memorama__card-area";
  area.dataset.index = i;

  const card = document.createElement("div");
  card.className = "memorama__card";
  card.id = "card" + i;

  const back = document.createElement("div");
  back.className = "memorama__face memorama__face--back";
  back.id = "back" + i;
  const img = document.createElement("img");
  img.src = icon.src;
  img.alt = icon.alt;
  back.appendChild(img);

  const front = document.createElement("div");
  front.className = "memorama__face memorama__face--front";
  const questionIcon = document.createElement("i");
  questionIcon.className = "far fa-question-circle";
  front.appendChild(questionIcon);

  card.appendChild(back);
  card.appendChild(front);
  area.appendChild(card);

  return area;
}
// Create the game board
function generateBoard() {
  const icons = [...originalIcons, ...originalIcons];
  const board = document.getElementById("board");
  if (!board) return console.error("Element #board not found");

  selections = [];
  matches = 0;
  moves = 0;
  time = 0;
  gameStarted = true;
  gamePaused = false;
  locked = true;
  inPreview = true;
  clearInterval(timeInterval);
  updateStats();

  const shuffledIcons = icons.sort(() => Math.random() - 0.5);
  board.innerHTML = "";

  shuffledIcons.forEach((icon, i) => {
    const cardHTML = createCardHTML(icon, i);
    board.appendChild(cardHTML);
  });

  const allCards = document.querySelectorAll(".memorama__card");
  allCards.forEach(c => c.style.transform = "rotateY(180deg)");

  setTimeout(() => {
    allCards.forEach(c => {
      if (!c.classList.contains("memorama__card--matched")) {
        c.style.transform = "rotateY(0deg)";
      }
    });

    locked = false;
    inPreview = false;

    if (!gamePaused) {
      timeInterval = setInterval(() => {
        time++;
        updateStats();
        if (time >= 200) {
          endGame("⏱ Se acabó el tiempo");
        }
      }, 1000);
    }
  }, 3000);
}
// Handle card selection
function selectCard(i) {
  const card = document.getElementById("card" + i);
  if (!card || card.classList.contains("memorama__card--matched")) return;
  if (locked || selections.includes(i) || gamePaused) return;

  card.style.transform = "rotateY(180deg)";
  selections.push(i);

  if (selections.length === 2) {
    locked = true;
    moves++;
    if (moves >= 25) {
      endGame("📉 Alcanzaste el límite de 25 movimientos");
      return;
    }
    updateStats();
    setTimeout(() => checkPair(), 1000);
  }
}

// Check if selected cards match
function checkPair() {
  const [i1, i2] = selections;
  const back1 = document.getElementById("back" + i1);
  const back2 = document.getElementById("back" + i2);

  if (!back1 || !back2) {
    console.error("Selected cards not found.");
    selections = [];
    locked = false;
    return;
  }

  if (back1.innerHTML !== back2.innerHTML) {
    const card1 = document.getElementById("card" + i1);
    const card2 = document.getElementById("card" + i2);
    if (card1 && card2) {
      card1.style.transform = "rotateY(0deg)";
      card2.style.transform = "rotateY(0deg)";
    }
  } else {
    back1.style.background = "plum";
    back2.style.background = "plum";
    document.getElementById("card" + i1).classList.add("memorama__card--matched");
    document.getElementById("card" + i2).classList.add("memorama__card--matched");
    matches++;
  }

  updateStats();
  checkGameEnd();
  selections = [];
  locked = false;
}
// Update stats (matches, moves, time)
function updateStats() {
  document.getElementById("matches").textContent = matches;
  document.getElementById("moves").textContent = moves;
  document.getElementById("time").textContent = time;
}
// Check if the game is won
function checkGameEnd() {
  const totalPairs = originalIcons.length;
  if (gameStarted && matches === totalPairs) {
    gameStarted = false;
    clearInterval(timeInterval);
    setTimeout(() => {
      Swal.fire({
    title: "🎉 ¡Ganaste!",
    text: `Tiempo: ${time}s - Movimientos: ${moves}`,
    icon: "success",
    confirmButtonText: "Siguiente habitación",
    confirmButtonColor: "#00b894",
    background: "#2c2c3e",
    color: "#fff",
  }).then(() => {
    window.location.href = "/hangman"; // 👉 CAMBIÁ esto si vas a otra ruta
  });
    }, 500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start-button").addEventListener("click", () => {
    generateBoard();
    document.getElementById("start-button").style.display = "none";
    document.getElementById("pause-button").style.display = "inline-block";
    document.getElementById("restart-button").style.display = "inline-block";
    document.getElementById("stats").style.display = "flex";
  });

  document.getElementById("restart-button").addEventListener("click", () => {
    if (inPreview) return;
    generateBoard();
  });

  document.getElementById("pause-button").addEventListener("click", togglePause);

  const board = document.getElementById("board");
  board.addEventListener("click", (e) => {
    const area = e.target.closest(".memorama__card-area");
    if (area?.dataset.index) {
      selectCard(Number(area.dataset.index));
    }
  });
    // Hide buttons until game starts / Oculta botones hasta que inicie el juego
  document.getElementById("pause-button").style.display = "none";
  document.getElementById("restart-button").style.display = "none";
  document.getElementById("stats").style.display = "none";
});

function endGame(reason) {
  gameStarted = false;
  clearInterval(timeInterval);
  console.log("Se ejecutó endGame:", reason);


  Swal.fire({
    title: "💀 ¡Perdiste!",
    text: `${reason}\n .Intentá de nuevo.`,
    icon: "error",
    confirmButtonText: "Reiniciar",
    confirmButtonColor: "#f26419",
    background: "#2c2c3e",
    color: "#fff",
  }).then(() => {
    generateBoard();
  });
}

