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

// Toggle modo oscuro
function toggleDarkMode() {
  const icon = document.getElementById("darkmode-icon");
  document.body.classList.toggle("dark-mode");

  // Animación sutil de rotación del ícono
  icon.classList.add("rotate-icon");
  setTimeout(() => icon.classList.remove("rotate-icon"), 400);

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    icon.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    icon.textContent = "🌙";
  }
}

// Transición suave al cargar
window.addEventListener("load", () => {
  document.body.style.transition =
    "background-color 0.4s, color 0.4s, border-color 0.4s, box-shadow 0.4s";
});

// ============================
// 📩 FORMULARIO CON VALIDACIÓN + reCAPTCHA + Getform
// ============================

const form = document.querySelector("#contact-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtener valores
    const nombre = form.nombre.value.trim();
    const apellido = form.apellido.value.trim();
    const email = form.email.value.trim();
    const asunto = form.asunto.value.trim();
    const mensaje = form.mensaje.value.trim();
    const archivo = form.archivo.files[0];

    // Validar campos obligatorios
    if (!nombre || !apellido || !email || !asunto || !mensaje) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    // Validar archivo (opcional)
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

    // Validar reCAPTCHA
    const recaptchaToken = grecaptcha.getResponse();
    if (!recaptchaToken) {
      alert("Por favor, completa el reCAPTCHA antes de enviar.");
      return;
    }

    // Deshabilitar botón mientras se envía
    const btnEnviar = form.querySelector("button.btn-enviar");
    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";

    // Enviar datos mediante Fetch
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
    } finally {
      btnEnviar.disabled = false;
      btnEnviar.textContent = "Enviar";
    }
  });
}
