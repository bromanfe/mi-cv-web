// ============================
// 🌙 MODO OSCURO / CLARO
// ============================

// Detecta si el usuario prefiere modo oscuro
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Aplica preferencia almacenada o del sistema
if (!localStorage.getItem("theme") && prefersDark) {
  document.body.classList.add("dark-mode");
  localStorage.setItem("theme", "dark");
} else if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const icon = document.getElementById("darkmode-icon");
  const btn = document.querySelector(".toggle-darkmode");
  const isDark = document.body.classList.contains("dark-mode");

  // Cambia el ícono y guarda preferencia
  icon.textContent = isDark ? "☀️" : "🌙";
  btn.setAttribute("aria-pressed", isDark ? "true" : "false");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Transición suave al cargar
window.addEventListener("load", () => {
  document.body.style.transition = "background-color 0.4s ease, color 0.4s ease";
});

// ============================
// 📩 FORMULARIO CON VALIDACIÓN + reCAPTCHA + Getform
// ============================

const form = document.querySelector("#contact-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const apellido = form.apellido.value.trim();
    const email = form.email.value.trim();
    const asunto = form.asunto.value.trim();
    const mensaje = form.mensaje.value.trim();
    const archivo = form.archivo.files[0];

    // Validación básica
    if (!nombre || !apellido || !email || !asunto || !mensaje) {
      mostrarMensaje("⚠️ Por favor, completa todos los campos obligatorios.", "warning");
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mostrarMensaje("📧 Ingresa un correo electrónico válido.", "error");
      return;
    }

    // Validar archivo
    if (archivo) {
      const maxSizeMB = 5;
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (archivo.size > maxSizeMB * 1024 * 1024) {
        mostrarMensaje(`📎 El archivo no debe superar ${maxSizeMB} MB.`, "warning");
        return;
      }
      if (!allowedTypes.includes(archivo.type)) {
        mostrarMensaje("Solo se permiten archivos PDF, JPG o PNG.", "error");
        return;
      }
    }

    // Validar reCAPTCHA
    const recaptchaToken = grecaptcha.getResponse();
    if (!recaptchaToken) {
      mostrarMensaje("🤖 Por favor, completa el reCAPTCHA antes de enviar.", "warning");
      return;
    }

    // Envío del formulario
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        mostrarMensaje("✅ Formulario enviado correctamente. ¡Gracias por contactarme!", "success");
        form.reset();
        grecaptcha.reset();
      } else {
        mostrarMensaje("⚠️ Ocurrió un error al enviar el formulario. Intenta nuevamente.", "error");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      mostrarMensaje("❌ No se pudo enviar. Verifica tu conexión e intenta otra vez.", "error");
    }
  });
}

// ============================
// 🌐 CAMBIO DE IDIOMA CON BOTONES TOGGLE
// ============================

const langButtons = document.querySelectorAll(".lang-btn");

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedLang = button.getAttribute("data-lang");

    langButtons.forEach((btn) => {
      btn.classList.toggle("active", btn === button);
      btn.setAttribute("aria-pressed", btn === button ? "true" : "false");
    });

    document.querySelectorAll(".lang-es").forEach((el) => {
      el.style.display = selectedLang === "es" ? "" : "none";
    });
    document.querySelectorAll(".lang-en").forEach((el) => {
      el.style.display = selectedLang === "en" ? "" : "none";
    });

    localStorage.setItem("selectedLanguage", selectedLang);
  });
});

// Mantener idioma elegido entre sesiones
window.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("selectedLanguage") || "es";
  const activeButton = [...langButtons].find(
    (btn) => btn.getAttribute("data-lang") === savedLang
  );
  if (activeButton) activeButton.click();
});

// ============================
// 💬 Función para mostrar alertas personalizadas
// ============================

function mostrarMensaje(texto, tipo = "info") {
  // Evita duplicados
  const mensajeExistente = document.querySelector(".alerta-flotante");
  if (mensajeExistente) mensajeExistente.remove();

  const alerta = document.createElement("div");
  alerta.className = `alerta-flotante ${tipo}`;
  alerta.textContent = texto;
  document.body.appendChild(alerta);

  setTimeout(() => {
    alerta.classList.add("visible");
  }, 100);

  setTimeout(() => {
    alerta.classList.remove("visible");
    setTimeout(() => alerta.remove(), 400);
  }, 4000);
}

// ============================
// 🎨 Estilos dinámicos de alerta
// ============================

const estiloAlertas = document.createElement("style");
estiloAlertas.textContent = `
  .alerta-flotante {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #ffffff;
    color: #002147;
    border-left: 6px solid #004080;
    border-radius: 10px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    padding: 14px 18px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease;
    z-index: 9999;
    max-width: 320px;
  }

  .alerta-flotante.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .alerta-flotante.success {
    border-left-color: #1abc9c;
  }

  .alerta-flotante.error {
    border-left-color: #e74c3c;
  }

  .alerta-flotante.warning {
    border-left-color: #f0b429;
  }

  body.dark-mode .alerta-flotante {
    background: #1e1e1e;
    color: #f5f5f5;
  }
`;
document.head.appendChild(estiloAlertas);
