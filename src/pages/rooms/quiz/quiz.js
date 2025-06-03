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

    let selectedQuestions = [];
    let currentQuestionIndex = 0;
    let hasAnswered = false;
    let timerInterval;
    let remainingTime;
    let initialTime;

    // DOM Elements
    let questionElement, optionsContainer, nextButton, currentSpan, totalSpan, remainingTimeElement, modal, navigationButtons;

    function initializeDOMElements() {
      questionElement = document.getElementById("question-text");
      optionsContainer = document.getElementById("options-container");
      nextButton = document.getElementById("next-question");
      currentSpan = document.getElementById("current-question");
      totalSpan = document.getElementById("total-questions");
      remainingTimeElement = document.getElementById('remaining-time');
      modal = document.getElementById("game-modal");
      navigationButtons = document.querySelectorAll(".navigation-button button");
      
      const quizElement = document.querySelector('.quiz');
      if (quizElement && quizElement.dataset.initialTime) {
        initialTime = parseInt(quizElement.dataset.initialTime);
      } else {
        initialTime = 45;
      }
    }

    function initializeQuiz() {
      if (!questionElement) {
        console.error("Los elementos del DOM no están inicializados");
        return;
      }
      
      selectedQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
      if (totalSpan) totalSpan.textContent = `/ ${selectedQuestions.length}`;
      currentQuestionIndex = 0;
      hasAnswered = false;
      remainingTime = initialTime;
      
      if (remainingTimeElement) {
        remainingTimeElement.textContent = remainingTime;
        remainingTimeElement.parentElement.style.color = "#a6d189";
      }
      
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      startTimer();
      displayQuestion();
    }

    function startTimer() {
      if (!remainingTimeElement) return;
      
      remainingTimeElement.parentElement.style.color = '#a6d189';
      timerInterval = setInterval(() => {
        remainingTime--;
        remainingTimeElement.textContent = remainingTime;

        if (remainingTime <= 15) {
          remainingTimeElement.parentElement.style.color = '#e78284';
        }

        if (remainingTime <= 0) {
          clearInterval(timerInterval);
          resetQuiz();
        }
      }, 1000);
    }

    function displayQuestion() {
      if (!questionElement || !optionsContainer || !nextButton || !currentSpan) return;
      
      const question = selectedQuestions[currentQuestionIndex];
      questionElement.innerHTML = question.question;
      optionsContainer.innerHTML = "";
      hasAnswered = false;
      nextButton.disabled = true;

      const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
      shuffledOptions.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option");
        button.onclick = () => selectOption(button, question.answer);
        optionsContainer.appendChild(button);
      });

      currentSpan.textContent = currentQuestionIndex + 1;
    }

    function selectOption(selectedElement, correctAnswer) {
      if (hasAnswered || !nextButton) return;

      const allOptions = document.querySelectorAll("#options-container button");
      allOptions.forEach(option => option.style.pointerEvents = "none");
      hasAnswered = true;

      if (selectedElement.textContent === correctAnswer) {
        selectedElement.classList.add("correct");
        addIcon(selectedElement, "✅");
        nextButton.disabled = false;
      } else {
        selectedElement.classList.add("incorrect");
        addIcon(selectedElement, "❌");
        allOptions.forEach(option => {
          if (option.textContent === correctAnswer) {
            option.classList.add("correct");
            addIcon(option, "✅");
          }
        });
        nextButton.disabled = true;
        setTimeout(resetQuiz, 1500);
      }
    }

    function addIcon(element, icon) {
      const span = document.createElement("span");
      span.textContent = icon;
      span.classList.add("option-icon");
      element.appendChild(span);
    }

    function resetQuiz() {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      initializeQuiz();
    }

    function showGameEnd() {
      if (!questionElement || !optionsContainer || !nextButton) return;
      
      questionElement.textContent = "¡Has terminado el quiz! 🎉";
      optionsContainer.innerHTML = "";
      nextButton.disabled = true;
      nextButton.textContent = "¡Genial! ¿Listo para más desafíos? 🚀";
      
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      enableNavigationButtons();
      showModal("🎉 ¡Ganaste!", "Sos una mente brillante, dev crack 😎", true);
    }

    function enableNavigationButtons() {
      if (navigationButtons) {
        navigationButtons.forEach(btn => {
          btn.disabled = false;
          btn.style.cursor = "pointer";
          btn.style.opacity = "1";
        });
      }
    }

    function showModal(title, message, showNextBtn) {
      const modalTitle = document.getElementById("modal-title");
      const modalMessage = document.getElementById("modal-message");
      
      if (modalTitle) modalTitle.textContent = title;
      if (modalMessage) modalMessage.textContent = message;
      if (modal) modal.classList.add("show");
    }

    function setupEventListeners() {
      if (nextButton) {
        nextButton.onclick = () => {
          if (currentQuestionIndex < selectedQuestions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
          } else {
            showGameEnd();
          }
        };
      }

      const modalReplayBtn = document.getElementById('modal-replay');
      if (modalReplayBtn) {
        modalReplayBtn.onclick = () => {
          if (modal) {
            modal.classList.remove('show');
          }
          resetQuiz();
        };
      }

      const modalNextBtn = document.getElementById('modal-next');
      if (modalNextBtn) {
        modalNextBtn.onclick = () => {
          if (modal) {
            modal.classList.remove('show');
          }
          // Navegar a la siguiente habitación
          window.location.href = '/rooms/memory';
        };
      }

      if (modal) {
        const backdrop = modal.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.onclick = () => {
            modal.classList.remove('show');
          };
        }
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      initializeDOMElements();
      setupEventListeners();
      initializeQuiz();
    });

    window.addEventListener('beforeunload', () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    });