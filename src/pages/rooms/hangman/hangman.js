document.addEventListener("DOMContentLoaded", () => {
  const wordEl = document.getElementById("word");
  const hintEl = document.getElementById("hint");
  const usedLettersEl = document.getElementById("used-letters");
  const messageEl = document.getElementById("message");
  const input = document.getElementById("letter-input");
  const form = document.getElementById("form");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const resetBtn = document.getElementById("reset");

  const modal = document.getElementById("game-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalMessage = document.getElementById("modal-message");
  const modalReplay = document.getElementById("modal-replay");
  const modalNext = document.getElementById("modal-next");
  const nextRoomButtons = document.querySelectorAll(".arrow-btn");

  let word = "";
  let hint = "";
  let usedLetters = [];
  let errors = 0;
  const maxErrors = 6;

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
      input.disabled = false;

      // Bloquear botones flecha al iniciar o reiniciar
      nextRoomButtons.forEach((btn) => {
        btn.disabled = true;
        btn.style.cursor = "not-allowed";
        btn.style.opacity = "0.5";
      });
    } catch (error) {
      messageEl.textContent = "No se pudo cargar la palabra 😢";
    }
  }

  function updateWordDisplay() {
    const display = word
      .split("")
      .map((letter) => (usedLetters.includes(letter) ? letter : "_"))
      .join(" ");

    wordEl.textContent = display;

    if (!display.includes("_")) {
      input.disabled = true;
      input.blur();
      setTimeout(() => {
        showModal("🎉 ¡Ganaste!", "¡Buen trabajo dev 😎!", false); // <== solo un botón
      }, 500);
    }
  }

  function updateUsedLetters() {
    usedLettersEl.textContent = usedLetters.join(", ");
  }

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
          showModal("💀 ¡Perdiste!", `La palabra era: ${word}`, false);
        }, 500);
        break;
    }
    ctx.stroke();
  }

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

  function showModal(title, message, showNextBtn) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.add("show");

    if (modalNext) {
      modalNext.style.display = showNextBtn ? "inline-block" : "none";
    }
  }

  modalReplay.addEventListener("click", () => {
    modal.classList.remove("show");

    if (modalTitle.textContent.includes("¡Ganaste")) {
      enableNextButtons(); // desbloquea flechitas solo después de ganar
    } else {
      resetBtn.click(); // reinicia si perdiste
    }
  });

  modalNext?.addEventListener("click", () => {
    window.location.href = "/rooms/quiz";
  });

  function enableNextButtons() {
    nextRoomButtons.forEach((btn) => {
      btn.disabled = false;
      btn.style.cursor = "pointer";
      btn.style.opacity = "1";
    });
  }

  resetBtn.addEventListener("click", () => {
    pickRandomWord();
    input.focus();
  });

  pickRandomWord();
});
