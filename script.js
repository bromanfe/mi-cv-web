// ============================
// 🌙 MODO OSCURO / CLARO
// ============================

// Detecta si el usuario prefiere modo oscuro
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Aplica preferencia almacenada o del sistema
if (!localStorage.getItem("theme") && prefersDark) {
  document.body.classList.add("dark-mode");
} else if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const icon = document.getElementById("darkmode-icon");
  const btn = document.querySelector(".toggle-darkmode");
  const isDark = document.body.classList.contains("dark-mode");
  icon.textContent = isDark ? "☀️" : "🌙";
  btn.setAttribute("aria-pressed", isDark ? "true" : "false");
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

    if (!nombre || !apellido || !email || !asunto || !mensaje) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    if (archivo) {
      const maxSizeMB = 5;
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (archivo.size > maxSizeMB * 1024 * 1024) {
        alert(`El archivo no debe superar ${maxSizeMB} MB.`);
        return;
      }
      if (!allowedTypes.includes(archivo.type)) {
        alert("Solo se permiten archivos PDF, JPG o PNG.");
        return;
      }
    }

    const recaptchaToken = grecaptcha.getResponse();
    if (!recaptchaToken) {
      alert("Por favor, completa el reCAPTCHA antes de enviar.");
      return;
    }

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("✅ Formulario enviado correctamente. ¡Gracias por contactarme!");
        form.reset();
        grecaptcha.reset();
      } else {
        alert("⚠️ Ocurrió un error al enviar el formulario. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("❌ No se pudo enviar. Verifica tu conexión e intenta otra vez.");
    }
  });
}

// ============================
// 🌐 CAMBIO DE IDIOMA ES-EN
// ============================

const languageSwitcher = document.getElementById("language-switcher");

languageSwitcher.addEventListener("change", (e) => {
  const selectedLang = e.target.value;
  document.querySelectorAll(".lang-es").forEach((el) => {
    el.style.display = selectedLang === "es" ? "" : "none";
  });
  document.querySelectorAll(".lang-en").forEach((el) => {
    el.style.display = selectedLang === "en" ? "" : "none";
  });
  localStorage.setItem("selectedLanguage", selectedLang);
});

// Al cargar la página, aplicar idioma guardado o español por defecto
window.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("selectedLanguage") || "es";
  languageSwitcher.value = savedLang;
  languageSwitcher.dispatchEvent(new Event("change"));
});
