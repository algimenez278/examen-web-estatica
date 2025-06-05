// hangman.js
export function initHangman() {
  const wordEl = document.getElementById("word");
  const hintEl = document.getElementById("hint");
  const usedLettersEl = document.getElementById("used-letters");
  const messageEl = document.getElementById("message");
  const input = document.getElementById("letter-input");
  const form = document.getElementById("form");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const resetBtn = document.getElementById("reset");

  let word = "";
  let hint = "";
  let usedLetters = [];
  let errors = 0;
  const maxErrors = 6;

  async function pickRandomWord() {
    try {
      const res = await fetch("/rooms/hangman/word.json");
      const data = await res.json();
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
    } catch {
      messageEl.textContent = "No se pudo cargar la palabra 😢";
    }
  }

  function updateWordDisplay() {
    const display = word
      .split("")
      .map((l) => (usedLetters.includes(l) ? l : "_"))
      .join(" ");
    wordEl.textContent = display;

    if (!display.includes("_")) {
      input.disabled = true;
      messageEl.textContent = "🎉 ¡Ganaste!";
      const btnPrev = document.getElementById("btn-prev");
      const btnNext = document.getElementById("btn-next");
      if (btnPrev) {
        btnPrev.disabled = false;
        btnPrev.style.cursor = "pointer";
        btnPrev.style.opacity = "1";
      }
      if (btnNext) {
        btnNext.disabled = false;
        btnNext.style.cursor = "pointer";
        btnNext.style.opacity = "1";
      }
    }
  }

  function updateUsedLetters() {
    usedLettersEl.textContent = usedLetters.join(", ");
  }

  function drawHangman() {
    ctx.beginPath();
    switch (errors) {
      case 1:
        ctx.moveTo(10, 240);
        ctx.lineTo(190, 240);
        break;
      case 2:
        ctx.moveTo(50, 240);
        ctx.lineTo(50, 20);
        ctx.lineTo(140, 20);
        ctx.lineTo(140, 40);
        break;
      case 3:
        ctx.arc(140, 60, 20, 0, Math.PI * 2);
        break;
      case 4:
        ctx.moveTo(140, 80);
        ctx.lineTo(140, 150);
        break;
      case 5:
        ctx.moveTo(140, 100);
        ctx.lineTo(120, 130);
        ctx.moveTo(140, 100);
        ctx.lineTo(160, 130);
        break;
      case 6:
        ctx.moveTo(140, 150);
        ctx.lineTo(120, 190);
        ctx.moveTo(140, 150);
        ctx.lineTo(160, 190);
        input.disabled = true;
        messageEl.textContent = `💀 Perdiste. La palabra era: ${word}`;
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

    document.getElementById("btn-prev")?.setAttribute("disabled", true);
    document.getElementById("btn-next")?.setAttribute("disabled", true);

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

  resetBtn.addEventListener("click", () => {
    pickRandomWord();
    input.focus();
  });

  pickRandomWord();
}

// ✅ Solo ejecutar en el navegador (evita error en el build de Astro)
if (typeof window !== "undefined" && typeof document !== "undefined") {
  initHangman();
}
