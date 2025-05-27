console.log("¿SweetAlert2 está disponible?", typeof Swal !== "undefined");

document.addEventListener("DOMContentLoaded", () => {
  // 🎮 Elementos del DOM
  const wordEl = document.getElementById("word");
  const hintEl = document.getElementById("hint");
  const usedLettersEl = document.getElementById("used-letters");
  const messageEl = document.getElementById("message");
  const input = document.getElementById("letter-input");
  const form = document.getElementById("form");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const resetBtn = document.getElementById("reset");

  // 🧠 Estado del juego
  let word = "";
  let hint = "";
  let usedLetters = [];
  let errors = 0;
  const maxErrors = 6;

  // 🔄 Cargar una palabra aleatoria del archivo JSON
  async function pickRandomWord() {
    try {
      const response = await fetch("/data/word.json");
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

  // ✍️ Mostrar la palabra con letras adivinadas
  function updateWordDisplay() {
    const display = word
      .split("")
      .map((letter) => (usedLetters.includes(letter) ? letter : "_"))
      .join(" ");

    wordEl.textContent = display;

    if (word && !display.includes("_")) {
      input.disabled = true;

      setTimeout(() => {
        Swal.fire({
          title: "🎉 ¡Ganaste!",
          text: "Sos una mente brillante, dev crack 😎",
          icon: "success",
          showDenyButton: true,
          confirmButtonText: "Volver a jugar",
          denyButtonText: "Siguiente room",
          confirmButtonColor: "#f6ae2d",
          denyButtonColor: "#758e4f",
          background: "#2c2c3e",
          color: "#fff",
        }).then((result) => {
          if (result.isConfirmed) {
            resetBtn.click();
          } else if (result.isDenied) {
            // Acá se va a cambiar la ruta cuando se nsepa que room sigue
            console.log("Pasando a la siguiente room...");
            // window.location.href = "/siguiente-room"; // cuando esté lista
          }
        });
      }, 500); // 0.5 segundos
    }
  }

  // 🔤 Actualizar las letras que se usaron
  function updateUsedLetters() {
    usedLettersEl.textContent = usedLetters.join(", ");
  }

  // 💀 Dibujar el ahorcado en cada error
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
          Swal.fire({
            title: "💀 ¡Perdiste!",
            text: `La palabra era: ${word}`,
            icon: "error",
            confirmButtonText: "Intentar de nuevo",
            confirmButtonColor: "#f26419",
            background: "#2c2c3e",
            color: "#fff",
          }).then(() => {
            resetBtn.click();
          });
        }, 1000); // 1000 milisegundos = 1 segundo

        break;
    }

    ctx.stroke();
  }

  // ✅ Manejador del formulario
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

  // 🔁 Reiniciar juego
  resetBtn.addEventListener("click", () => {
    input.disabled = false;
    pickRandomWord();
    input.focus();
  });

  // 🚀 Empezar el juego al cargar
  pickRandomWord();
});
