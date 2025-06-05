const questions = [
  {
    question: "¿Qué representa una variable en programación?",
    options: ["Una función que se ejecuta automáticamente", "Un archivo externo", "Una estructura visual", "Un espacio de memoria con un nombre que guarda un valor"],
    answer: "Un espacio de memoria con un nombre que guarda un valor"
  },
  {
    question: "¿Qué imprime este código?\nlet edad = 18;\nconsole.log(edad >= 18);",
    options: ["null", '"true"', "undefined", "true"],
    answer: "true"
  },
  {
    question: "¿Cuál es la diferencia entre for y while?",
    options: ["while solo se usa para arrays", "for siempre es más rápido", "while no puede usar condiciones", "for se usa cuando sabemos cuántas veces repetir; while cuando no"],
    answer: "for se usa cuando sabemos cuántas veces repetir; while cuando no"
  },
  {
    question: "¿Qué hace este código?\nlet x = 10;\nif (x % 2 === 0) { console.log('Par'); } else { console.log('Impar'); }",
    options: ["Imprime 'Impar'", "Lanza un error", "Nada, '===' no es válido", "Imprime 'Par' si el número es divisible por 2"],
    answer: "Imprime 'Par' si el número es divisible por 2"
  },
  {
    question: "¿Qué es un array en programación?",
    options: ["Estructura que contiene funciones", "Tipo de objeto solo de strings", "Espacio de memoria aleatorio", "Una colección ordenada de elementos"],
    answer: "Una colección ordenada de elementos"
  },
  {
    question: "¿Qué imprime este código?\nlet arr = [10, 20, 30];\narr.push(40);\nconsole.log(arr.length);",
    options: ["3", "undefined", "arr", "4"],
    answer: "4"
  },
  {
    question: "¿Qué es una función pura?",
    options: ["Modifica variables globales", "Depende del estado externo", "Se ejecuta una vez", "Siempre da el mismo resultado sin efectos secundarios"],
    answer: "Siempre da el mismo resultado sin efectos secundarios"
  },
  {
    question: "¿Qué hace este código?\nsetTimeout(() => { console.log('Hola'); }, 0);\nconsole.log('Mundo');",
    options: ["Imprime Hola Mundo", "Lanza error de concurrencia", "Espera al sistema operativo", "Imprime 'Mundo' luego 'Hola'"],
    answer: "Imprime 'Mundo' luego 'Hola'"
  },
  {
    question: "¿Qué hace una estructura tipo pila?",
    options: ["Saca elementos de cualquier lugar", "Busca en bases de datos", "Lee datos en paralelo", "Accede en orden LIFO"],
    answer: "Accede en orden LIFO"
  },
  {
    question: "¿Qué hace este código?\nconst persona = { nombre: 'Ana' };\nObject.freeze(persona);\npersona.nombre = 'Luis';\nconsole.log(persona.nombre);",
    options: ["Cambia el nombre a Luis", "Elimina el objeto", "Crea una copia", "Imprime 'Ana' porque está congelado"],
    answer: "Imprime 'Ana' porque está congelado"
  },
  {
    question: "¿Qué se imprime?\nfunction saludar(nombre) {\n  return `Hola, ${nombre}`;\n}\nconsole.log(saludar('Juan'));",
    options: ["Hola, Juan", "Hola", "undefined", "Error"],
    answer: "Hola, Juan"
  },
  {
    question: "¿Qué hace este código?\nsetTimeout(() => {\n  console.log('Hola');\n}, 1000);",
    options: ["Imprime 'Hola' inmediatamente", "Nunca imprime nada", "Imprime 'Hola' después de 1 segundo", "Lanza un error"],
    answer: "Imprime 'Hola' después de 1 segundo"
  },
  {
    question: "¿Qué valor imprime?\nasync function test() {\n  return 'hecho';\n}\ntest().then(console.log);",
    options: ["undefined", "hecho", "Promise", "Error"],
    answer: "hecho"
  },
  {
    question: "¿Qué se imprime?\nconsole.log(typeof function() {});",
    options: ["object", "function", "undefined", "Error"],
    answer: "function"
  },
  {
    question: "¿Qué hace este código?\ndocument.querySelector('h1').textContent = 'Hola mundo';",
    options: ["Cambia el texto de un <h1>", "Agrega un nuevo h1", "Elimina el h1", "Lanza error siempre"],
    answer: "Cambia el texto de un <h1>"
  },
  {
    question: "¿Qué pasa aquí?\nconst boton = document.getElementById('miBoton');\nboton.addEventListener('click', () => alert('Clic!'));",
    options: ["Muestra 'Clic!' al hacer clic", "No hace nada", "Elimina el botón", "Agrega un nuevo botón"],
    answer: "Muestra 'Clic!' al hacer clic"
  },
  {
    question: "¿Qué ocurre si se ejecuta este código fuera de una función async?\nlet x = await Promise.resolve(42);",
    options: ["undefined", "Error de sintaxis", "42", "Promise"],
    answer: "Error de sintaxis"
  }
];

let currentQuestionIndex = 0;
let selectedQuestions = [];
let hasAnswered = false;

const initialTime = parseInt(document.querySelector("main.quiz").dataset.initialTime);
let time = initialTime
let timerInterval;

const questionElement = document.getElementById("question-text");
const optionButtons = document.querySelectorAll(".option__button");
const nextButton = document.getElementById("next-question");
const currentSpan = document.getElementById("current-question");
const totalSpan = document.getElementById("total-questions");
const remainingTime = document.getElementById("remaining-time");
const modal = document.getElementById("game-modal");
const nextRoomButton = document.getElementById("btn-next");

// iniciar juego
function startGame() {
  selectedQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
  totalSpan.textContent = `/ ${selectedQuestions.length}`;
  currentQuestionIndex = 0;
  time = initialTime;
  displayQuestion();
  startTimer();
}


function startTimer() {
  clearInterval(timerInterval);
  remainingTime.textContent = time;
  timerInterval = setInterval(() => {
    time--;
    remainingTime.textContent = time;
    if (time <= 0) {
      clearInterval(timerInterval);
      resetToFirstQuestion();
    }
  }, 1000);
}



function displayQuestion() {
  const question = selectedQuestions[currentQuestionIndex];
  questionElement.innerHTML = question.question.replace(/\n/g, "<br>");
  nextButton.disabled = true;
  hasAnswered = false;

  const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

  optionButtons.forEach((btn, index) => {
    btn.textContent = shuffledOptions[index];
    btn.classList.remove("correct", "incorrect");
    btn.disabled = false;

    // Remover íconos previos
    const icon = btn.querySelector(".option-icon");
    if (icon) icon.remove();

    btn.onclick = () => selectOption(btn, question.answer);
  });

  currentSpan.textContent = currentQuestionIndex + 1;
}

function selectOption(button, correctAnswer) {
  if (hasAnswered) return;
  hasAnswered = true;

  const allOptions = document.querySelectorAll(".option__button");
  allOptions.forEach(btn => btn.disabled = true);

  if (button.textContent === correctAnswer) {
    button.classList.add("correct");
    addIcon(button, "✅");
    nextButton.disabled = false;
  } else {
    button.classList.add("incorrect");
    addIcon(button, "❌");

    allOptions.forEach(btn => {
      if (btn.textContent === correctAnswer) {
        btn.classList.add("correct");
        addIcon(btn, "✅");
      }
    });
    setTimeout(resetToFirstQuestion, 1500);
  }
}

function addIcon(element, icon) {
  const span = document.createElement("span");
  span.textContent = icon;
  span.classList.add("option-icon");
  element.appendChild(span);
}

function resetToFirstQuestion() {
  clearInterval(timerInterval);
  currentQuestionIndex = 0; // Volver a la primera pregunta
  time = initialTime; // Resetear tiempo completo
  displayQuestion();
  startTimer();
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < selectedQuestions.length) {
    displayQuestion();
  } else {
    showVictory();
  }
});

function showVictory() {
  clearInterval(timerInterval);

  // Verificar si el modal existe y tiene el método showModal
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('show');
    const confirmButton = document.getElementById('modal-replay');
    
    if (confirmButton) {
      confirmButton.onclick = () => {
        modal.classList.add('hidden');
        modal.classList.remove('show');
        enableNavigationButtons();
      };
    }
  }
}
function enableNavigationButtons() {
  // Habilitar botón siguiente (derecha)
  if (nextRoomButton) {
    nextRoomButton.removeAttribute("disabled");
    nextRoomButton.style.opacity = "1";
    nextRoomButton.style.cursor = "pointer";
    nextRoomButton.classList.add("enabled");
  }
  
  // Habilitar botón anterior (izquierda) si existe
  const prevButton = document.getElementById("btn-prev");
  if (prevButton) {
    prevButton.removeAttribute("disabled");
    prevButton.style.opacity = "1";
    prevButton.style.cursor = "pointer";
    prevButton.classList.add("enabled");
  }
  
  // Hacer que los enlaces funcionen
  const navLinks = document.querySelectorAll('.navigation-button a');
  navLinks.forEach(link => {
    link.style.pointerEvents = 'auto';
  });
}
// Inicializar juego al cargar
startGame();

if (modal) {
  handleModalClose();
}