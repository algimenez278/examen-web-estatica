console.log("¿SweetAlert2 está disponible?", typeof Swal !== "undefined");

// Obtener colores desde :root
const rootStyles = getComputedStyle(document.documentElement);
const colors = {
  success: rootStyles.getPropertyValue("--green").trim(),
  error: rootStyles.getPropertyValue("--red").trim(),
  next: rootStyles.getPropertyValue("--sky").trim(),
  base: rootStyles.getPropertyValue("--base").trim(),
  text: rootStyles.getPropertyValue("--letter").trim(),
};

/**
 * Alerta genérica de victoria
 * @param {Object} options - Configuración de la alerta
 * @param {string} [options.title="🎉 ¡Ganaste!"]
 * @param {string} [options.text="Buen trabajo dev 😎"]
 * @param {Function} [options.onConfirm] - Acción al confirmar (opcional)
 */
export function showWinAlert({
  title = "🎉 ¡Ganaste!",
  text = "Buen trabajo dev 😎",
  onConfirm,
} = {}) {
  Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonText: "¡Genial!",
    confirmButtonColor: colors.success,
    background: colors.base,
    color: colors.text,
  }).then(() => {
    onConfirm?.();
  });
}

/**
 * Alerta genérica de derrota
 * @param {Object} options - Configuración de la alerta
 * @param {string} [options.title="💀 ¡Perdiste!"]
 * @param {string} [options.text="La próxima será..."]
 * @param {string} [options.word] - Palabra correcta (opcional)
 * @param {Function} [options.onReplay] - Acción para volver a jugar
 */
export function showLoseAlert({
  title = "💀 ¡Perdiste!",
  text = "La próxima será...",
  word,
  onReplay,
} = {}) {
  let finalText = text;
  if (word) {
    finalText += ` La palabra era: ${word}.`;
  }

  Swal.fire({
    title,
    text: finalText,
    icon: "error",
    confirmButtonText: "Intentar de nuevo",
    confirmButtonColor: colors.error,
    background: colors.base,
    color: colors.text,
  }).then(() => {
    onReplay?.();
  });
}
