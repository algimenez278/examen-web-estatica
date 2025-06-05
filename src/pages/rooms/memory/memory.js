// Generate an array of icon objects
function generateIcons(count) {
  return Array.from({ length: count }, (_, i) => ({
    src: `/assets/images-memory/icon${i + 1}.png`,
    alt: `icono ${i + 1}`,
  }));
}

const originalIcons = generateIcons(12);

let selections = [];
let locked = false;
let matches = 0;
let moves = 0;
let time = 0;
let timeInterval = null;
let gameStarted = false;
let gamePaused = false;
let inPreview = false;

// Toggle game pause and resume
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
// Create a card element with front and back faces
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

// Generate the game board with shuffled cards
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
// Check if selected cards form a matching pair
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

function updateStats() {
  document.getElementById("matches").textContent = matches;
  document.getElementById("moves").textContent = moves;
  document.getElementById("time").textContent = time;
}

// Check if all pairs have been found
function checkGameEnd() {
  const totalPairs = originalIcons.length;
  if (gameStarted && matches === totalPairs) {
    gameStarted = false;
    clearInterval(timeInterval);

    setTimeout(() => {
      showMessage(
        "🎉 ¡Ganaste!",
        `Pasa a la siguiente habitación 🚪➡️<br>Tiempo: ${time}s - Movimientos: ${moves}`
      );

      // Habilitar los botones de navegación
      const btnPrev = document.getElementById("btn-prev");
      const btnNext = document.getElementById("btn-next");
      enableButton(btnPrev);
      enableButton(btnNext);

    }, 500);
  }
}

// Enable a button visually and functionally
function enableButton(button) {
  if (button) {
    button.removeAttribute("disabled");
    button.style.opacity = "1";
    button.style.cursor = "pointer";
  }
}


// Handle game loss
function endGame(reason) {
  gameStarted = false;
  clearInterval(timeInterval);
  console.log("Se ejecutó endGame:", reason);

  showMessage(
    "💀 ¡Perdiste!",
    `${reason}. Intentá de nuevo.`,
    "",
    generateBoard
  );
}

// Show a message box with title, message, optional stats, and optional callback

function showMessage(title, message, stats = "", callback) {
  const box = document.getElementById("message-box");
  document.getElementById("message-title").textContent = title;
  document.getElementById("message-text").innerHTML = `<p>${message}</p><p>${stats}</p>`;

  const button = document.getElementById("message-button");
  button.onclick = () => {
    box.style.display = "none";
    if (typeof callback === "function") callback();
  };

  box.style.display = "block";
}


// Initialize event listeners when the page loads
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

  document.getElementById("pause-button").style.display = "none";
  document.getElementById("restart-button").style.display = "none";
  document.getElementById("stats").style.display = "none";
})

// This function hides the game message after a few seconds
function hideMessageAfterDelay(selector, delay = 3000) {
  const messageElement = document.querySelector(selector);
  if (!messageElement) return;

  setTimeout(() => {
    messageElement.style.display = "none";
  }, delay);
}

// Call the function when the game loads
hideMessageAfterDelay(".memorama__message", 4000);