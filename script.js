// ============================
// 🌙 MODO OSCURO / CLARO
// ============================

// Aplica preferencia almacenada o del sistema al cargar
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const storedTheme = localStorage.getItem("theme");

if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
  document.body.classList.add("dark-mode");
}

// Sincroniza ícono al cargar
function syncDarkmodeIcon() {
  const icon = document.getElementById("darkmode-icon");
  const btn = document.querySelector(".toggle-darkmode");
  const isDark = document.body.classList.contains("dark-mode");
  if (icon) icon.textContent = isDark ? "☀️" : "🌙";
  if (btn) btn.setAttribute("aria-pressed", isDark ? "true" : "false");
}

syncDarkmodeIcon();

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  syncDarkmodeIcon();
}

// ============================
// 🌐 CAMBIO DE IDIOMA
// ============================

const langButtons = document.querySelectorAll('.lang-btn');

function applyLanguage(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll('.lang-es').forEach(el => {
    el.style.display = lang === 'es' ? '' : 'none';
  });
  document.querySelectorAll('.lang-en').forEach(el => {
    el.style.display = lang === 'en' ? '' : 'none';
  });

  langButtons.forEach(btn => {
    const isActive = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  localStorage.setItem('selectedLanguage', lang);
}

langButtons.forEach(button => {
  button.addEventListener('click', () => {
    applyLanguage(button.getAttribute('data-lang'));
  });
});

// ============================
// 📅 FOOTER: AÑO ACTUAL
// ============================

const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================
// 👁️ SCROLL REVEAL (IntersectionObserver)
// ============================

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section-reveal').forEach(el => {
  revealObserver.observe(el);
});

// ============================
// 📊 SKILL BARS ANIMATION
// ============================

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => {
  skillObserver.observe(card);
});

// ============================
// 📩 FORMULARIO
// ============================

const form = document.querySelector("#contact-form");
const submitBtn = document.getElementById("submit-btn");
const formMessageEl = document.getElementById("form-message");

function showFormMessage(text, type) {
  if (!formMessageEl) return;
  formMessageEl.textContent = text;
  formMessageEl.className = `form-message ${type}`;
  formMessageEl.style.display = 'flex';
  // Auto-hide after 6s
  setTimeout(() => {
    formMessageEl.style.display = 'none';
  }, 6000);
}

function getMessages() {
  const lang = localStorage.getItem('selectedLanguage') || 'es';
  const msgs = {
    es: {
      required: "Por favor, completa todos los campos obligatorios.",
      email: "Por favor, ingresa un correo electrónico válido.",
      fileSize: "El archivo no debe superar 5 MB.",
      fileType: "Solo se permiten archivos PDF, JPG o PNG.",
      recaptcha: "Por favor, completa el reCAPTCHA antes de enviar.",
      sending: "Enviando...",
      success: "✅ Mensaje enviado correctamente. ¡Gracias por contactarme!",
      error: "⚠️ Ocurrió un error al enviar. Intenta nuevamente.",
      network: "❌ No se pudo enviar. Verifica tu conexión e intenta otra vez.",
      send: "Enviar mensaje",
    },
    en: {
      required: "Please fill in all required fields.",
      email: "Please enter a valid email address.",
      fileSize: "File must not exceed 5 MB.",
      fileType: "Only PDF, JPG, or PNG files are allowed.",
      recaptcha: "Please complete the reCAPTCHA before sending.",
      sending: "Sending...",
      success: "✅ Message sent successfully. Thanks for reaching out!",
      error: "⚠️ An error occurred while sending. Please try again.",
      network: "❌ Could not send. Check your connection and try again.",
      send: "Send message",
    }
  };
  return msgs[lang] || msgs.es;
}

if (form && submitBtn) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const m = getMessages();

    const nombre  = form.nombre.value.trim();
    const apellido = form.apellido.value.trim();
    const email   = form.email.value.trim();
    const asunto  = form.asunto.value.trim();
    const mensaje = form.mensaje.value.trim();
    const archivo = form.archivo.files[0];

    if (!nombre || !apellido || !email || !asunto || !mensaje) {
      showFormMessage(m.required, 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormMessage(m.email, 'error');
      return;
    }

    if (archivo) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (archivo.size > 5 * 1024 * 1024) {
        showFormMessage(m.fileSize, 'error');
        return;
      }
      if (!allowedTypes.includes(archivo.type)) {
        showFormMessage(m.fileType, 'error');
        return;
      }
    }

    if (typeof grecaptcha !== 'undefined' && !grecaptcha.getResponse()) {
      showFormMessage(m.recaptcha, 'error');
      return;
    }

    // Disable button while sending
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>${m.sending}</span>`;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
      });

      if (response.ok) {
        showFormMessage(m.success, 'success');
        form.reset();
        if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
      } else {
        showFormMessage(m.error, 'error');
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      showFormMessage(m.network, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

// ============================
// 🚀 INIT
// ============================

window.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('selectedLanguage') || 'es';
  applyLanguage(savedLang);
});
