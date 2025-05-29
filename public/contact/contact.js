document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");

  const fields = {
    name: {
      input: document.getElementById("name"),
      error: createOrGetError("name"),
      validate: (value) => value.trim().length >= 2,
      message: "Debe tener al menos 2 caracteres.",
    },
    email: {
      input: document.getElementById("email"),
      error: createOrGetError("email"),
      validate: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: "Ingresá un correo válido.",
    },
    message: {
      input: document.getElementById("message"),
      error: createOrGetError("message"),
      validate: (value) => value.trim().length >= 10,
      message: "El mensaje debe tener al menos 10 caracteres.",
    },
  };

  function createOrGetError(fieldId) {
    let errorEl = document.getElementById(`${fieldId}Error`);
    if (!errorEl) {
      errorEl = document.createElement("small");
      errorEl.id = `${fieldId}Error`;
      errorEl.style.color = "var(--yellow)";
      errorEl.style.display = "block";
      errorEl.style.marginTop = "5px";
      const input = document.getElementById(fieldId);
      input.parentElement.appendChild(errorEl);
    }
    return errorEl;
  }

  function validateField(field) {
    const value = field.input.value;
    if (!field.validate(value)) {
      field.error.textContent = `⚠️ ${field.message}`;
      field.input.style.borderColor = "var(--yellow)";
      return false;
    } else {
      field.error.textContent = "";
      field.input.style.borderColor = "var(--carolina)";
      return true;
    }
  }

  function validateForm() {
    let isValid = true;
    Object.values(fields).forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });
    submitBtn.disabled = !isValid;
  }

  Object.values(fields).forEach(({ input }) => {
    input.addEventListener("input", validateForm);
  });

  // Inicializar el estado del botón
  validateForm();
});
