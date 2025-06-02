console.log("¿SweetAlert2 está disponible?", typeof Swal !== "undefined");

/**
 * Obtiene los colores del root sólo en el navegador
 */
function getRootColors() {
  if (typeof window === "undefined") return {}; // Evita errores en build

  const rootStyles = getComputedStyle(document.documentElement);
  return {
    success: rootStyles.getPropertyValue("--green").trim(),
    error: rootStyles.getPropertyValue("--red").trim(),
    next: rootStyles.getPropertyValue("--sky").trim(),
    base: rootStyles.getPropertyValue("--base").trim(),
    text: rootStyles.getPropertyValue("--letter").trim(),
  };
}

/**
 * Alerta genérica de victoria
 */
export function showWinAlert({
  title = "🎉 ¡Ganaste!",
  text = "Buen trabajo dev 😎",
  onConfirm,
} = {}) {
  const colors = getRootColors();

  if (typeof Swal !== "undefined") {
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
}

/**
 * Alerta genérica de derrota
 */
export function showLoseAlert({
  title = "💀 ¡Perdiste!",
  text = "La próxima será...",
  word,
  onReplay,
} = {}) {
  const colors = getRootColors();

  let finalText = text;
  if (word) finalText += ` La palabra era: ${word}.`;

  if (typeof Swal !== "undefined") {
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
}
