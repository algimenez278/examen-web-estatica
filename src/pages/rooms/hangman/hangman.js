import { showWinAlert, showLoseAlert } from "../../../utils/alerts.js";

document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const wordEl = document.getElementById("word");
  const hintEl = document.getElementById("hint");
  const usedLettersEl = document.getElementById("used-letters");
  const messageEl = document.getElementById("message");
  const input = document.getElementById("letter-input");
  const form = document.getElementById("form");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const resetBtn = document.getElementById("reset");

  // Estado del juego
  let word = "";
  let hint = "";
  let usedLetters = [];
  let errors = 0;
  const maxErrors = 6;

  // Cargar una palabra aleatoria del archivo JSON (se utiliza fetch y async/await)
  async function pickRandomWord() {
    try {
      const response = await fetch("/rooms/hangman/word.json");
      const data = await response.json();
      const words = data.record;
      const random = words[Math.floor(Math.random() * words.length)];

      word = random.word.toUpperCase();
      hint = random.hint;
      usedLetters = [];
      errors = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      hintEl.textContent = `Pista: ${hint}`;
      messageEl.textContent = "";
      updateWordDisplay();
      updateUsedLetters();
    } catch (error) {
      messageEl.textContent = "No se pudo cargar la palabra 😢";
      console.error("Error fetching word.json:", error);
    }
  }

  // Mostrar la palabra con letras adivinadas
  function updateWordDisplay() {
    const display = word
      .split("")
      .map((letter) => (usedLetters.includes(letter) ? letter : "_"))
      .join(" ");

    wordEl.textContent = display;

    if (word && !display.includes("_")) {
      input.disabled = true;
      input.blur();

      setTimeout(() => {
        showWinAlert({
          onConfirm: () => {
            console.log("Pasando a la siguiente room...");
            /* document.getElementById("next-room-btn").style.display =
              "inline-flex"; */
            /* window.location.href = "/rooms/quiz"; */
            document
              .getElementById("next-room-wrapper")
              .classList.remove("locked");
            document
              .getElementById("next-room-wrapper")
              .classList.add("unlocked");
          },
        });
      }, 500);
    }
  }

  // actualiza las letras que se usaron
  function updateUsedLetters() {
    usedLettersEl.textContent = usedLetters.join(", ");
  }

  // dibuja el ahorcado en cada error
  function drawHangman() {
    ctx.beginPath();

    switch (errors) {
      case 1:
        ctx.moveTo(10, 180);
        ctx.lineTo(150, 180);
        break;
      case 2:
        ctx.moveTo(40, 180);
        ctx.lineTo(40, 20);
        ctx.lineTo(120, 20);
        ctx.lineTo(120, 40);
        break;
      case 3:
        ctx.arc(120, 60, 15, 0, Math.PI * 2);
        break;
      case 4:
        ctx.moveTo(120, 75);
        ctx.lineTo(120, 130);
        break;
      case 5:
        ctx.moveTo(120, 90);
        ctx.lineTo(100, 110);
        ctx.moveTo(120, 90);
        ctx.lineTo(140, 110);
        break;
      case 6:
        ctx.moveTo(120, 130);
        ctx.lineTo(100, 160);
        ctx.moveTo(120, 130);
        ctx.lineTo(140, 160);
        input.disabled = true;

        setTimeout(() => {
          showLoseAlert(word, () => resetBtn.click());
        }, 1000);
        // 1 seg de delay
        break;
    }

    ctx.stroke();
  }

  // input de la letra
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const letter = input.value.toUpperCase();

    if (!letter.match(/^[A-ZÑ]$/)) {
      messageEl.textContent = "Ingresá una letra válida (A-Z)";
      return;
    }

    if (usedLetters.includes(letter)) {
      messageEl.textContent = "Ya usaste esa letra 😅";
      return;
    }

    usedLetters.push(letter);

    if (word.includes(letter)) {
      updateWordDisplay();
    } else {
      errors++;
      drawHangman();
    }

    updateUsedLetters();
    input.value = "";
    input.focus();
  });

  // reiniciar juego
  resetBtn.addEventListener("click", () => {
    input.disabled = false;
    pickRandomWord();
    input.focus();
  });

  // empezar juego al cargar
  pickRandomWord();
});
