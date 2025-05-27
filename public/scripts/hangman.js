// Wait for the DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const wordEl = document.getElementById("word");
  const hintEl = document.getElementById("hint");
  const usedLettersEl = document.getElementById("used-letters");
  const messageEl = document.getElementById("message");
  const input = document.getElementById("letter-input");
  const form = document.getElementById("form");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const resetBtn = document.getElementById("reset");

  // Game state
  let word = "";
  let hint = "";
  let usedLetters = [];
  let errors = 0;
  const maxErrors = 6;

  // Get word from external JSON file
  async function pickRandomWord() {
    try {
      const response = await fetch("/data/word.json"); // Must be located in /public/data/word.json
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

  function updateWordDisplay() {
    const display = word
      .split("")
      .map((letter) => (usedLetters.includes(letter) ? letter : "_"))
      .join(" ");
    wordEl.textContent = display;

    if (!display.includes("_")) {
      messageEl.textContent = "🎉 ¡Ganaste!";
      input.disabled = true;
    }
  }

  function updateUsedLetters() {
    usedLettersEl.textContent = usedLetters.join(", ");
  }

  function drawHangman() {
    ctx.beginPath(); // Siempre empezá un nuevo trazo limpio

    switch (errors) {
      case 1: // base
        ctx.moveTo(10, 180);
        ctx.lineTo(150, 180);
        break;

      case 2: // poste y soporte
        ctx.moveTo(40, 180);
        ctx.lineTo(40, 20);
        ctx.lineTo(120, 20);
        ctx.lineTo(120, 40);
        break;

      case 3: // cabeza
        ctx.arc(120, 60, 15, 0, Math.PI * 2); // centro (120,60), radio 15
        break;

      case 4: // cuerpo
        ctx.moveTo(120, 75);
        ctx.lineTo(120, 130);
        break;

      case 5: // brazos
        ctx.moveTo(120, 90);
        ctx.lineTo(100, 110);
        ctx.moveTo(120, 90);
        ctx.lineTo(140, 110);
        break;

      case 6: // piernas
        ctx.moveTo(120, 130);
        ctx.lineTo(100, 160);
        ctx.moveTo(120, 130);
        ctx.lineTo(140, 160);
        messageEl.textContent = `💀 Perdiste. La palabra era: ${word}`;
        input.disabled = true;
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

  resetBtn.addEventListener("click", () => {
    input.disabled = false;
    pickRandomWord();
    input.focus();
  });

  // Start game on load
  pickRandomWord();
});
