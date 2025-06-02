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
        options: ["undefined", "'hecho'", "Promise", "Error"],
        answer: "'hecho'"
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
        question: "¿Qué valor tiene 'x'?\nlet x = await Promise.resolve(42);",
        options: ["undefined", "Error de sintaxis", "42", "Promise"],
        answer: "Error de sintaxis"
    }

];

let selected = [];
let current = 0;
let answered = false;
let interval;
const initialTime = parseInt(document.querySelector('.quiz').dataset.initialTime) 

const devQuestion = document.getElementById("question");
const devOption = document.getElementById("options");
const nextButton = document.getElementById("following");
const spanActual = document.getElementById("currents");
const spanTotal = document.getElementById("total");
const remainingTimeEl = document.getElementById('remaining-time');

function initQuiz() {
    selected = questions.sort(() => Math.random() - 0.5).slice(0, 5);
    spanTotal.textContent = `/ ${selected.length}`;
    current = 0;
    answered = false;
    remainingTime = initialTime;
    remainingTimeEl.textContent = remainingTime;
    remainingTimeEl.parentElement.style.color = "#000";
    clearInterval(interval);
    startTimer();
    showQuestion();
}

function startTimer() {
    remainingTimeEl.parentElement.style.color = '#a6d189';
    interval = setInterval(() => {
        remainingTime--;
        
        
        remainingTimeEl.textContent = remainingTime;

        if (remainingTime <= 15) {
            remainingTimeEl.parentElement.style.color = '#e78284';
        }

        if (remainingTime <= 0) {
            clearInterval(interval);
            resetQuiz();
        }
    }, 950);
}

function showQuestion() {
    const question = selected[current];
    devQuestion.innerHTML = question.question;
    devOption.innerHTML = "";
    answered = false;
    nextButton.disabled = true; 

    const mixed = [...question.options].sort(() => Math.random() - 0.5);
    mixed.forEach(option => {
        const li = document.createElement("li");
        li.textContent = option;
        li.classList.add("option");
        li.onclick = () => selectionOptions(li, question.answer);
        devOption.appendChild(li);
    });

    spanActual.textContent = current + 1;
}


function selectionOptions(element, correctAnswer) {
    if (answered) return;

    const optiones = document.querySelectorAll("#options li");
    optiones.forEach(op => op.style.pointerEvents = "none");
    answered = true;

    if (element.textContent === correctAnswer) {
        element.classList.add("correcta");
        addIcons(element, "✅");
        nextButton.disabled = false;

    } else {
        element.classList.add("incorrecta");
        addIcons(element, "❌");
        optiones.forEach(op => {
            if (op.textContent === correctAnswer) {
                op.classList.add("correcta");
                addIcons(op, "✅");
            }
        });
        nextButton.disabled = true;
        setTimeout(resetQuiz, 1500);
    }
}


function addIcons(element, icono) {
    const span = document.createElement("span");
    span.textContent = icono;
    element.appendChild(span);
}

function resetQuiz() {
    clearInterval(interval);
    initQuiz();
}

nextButton.onclick = () => {
    if (current < selected.length - 1) {
        current++;
        showQuestion();
    } else {
        showEnd();
    }
};

function showEnd() {
    devQuestion.textContent = `¡Has terminado el quiz! 🎉`;
    devOption.innerHTML = "";
    nextButton.disabled = true;
    nextButton.textContent = "¡Genial! ¿Listo para más desafíos? 🚀";
    clearInterval(interval);
}

document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
});