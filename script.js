// ============================
// MODO OSCURO / CLARO (clase en <html> + anti-FOUC vía inline en HTML)
// ============================

const root = document.documentElement;

function syncDarkmodeIcon() {
  const icon = document.getElementById("darkmode-icon");
  const btn = document.getElementById("toggle-darkmode");
  const isDark = root.classList.contains("dark-mode");
  if (icon) icon.textContent = isDark ? "☀️" : "🌙";
  if (btn) {
    btn.setAttribute("aria-pressed", isDark ? "true" : "false");
    const lang = localStorage.getItem("selectedLanguage") || "es";
    const on = lang === "es" ? "Activar modo claro" : "Switch to light mode";
    const off = lang === "es" ? "Activar modo oscuro" : "Switch to dark mode";
    btn.setAttribute("aria-label", isDark ? on : off);
  }
}

function toggleDarkMode() {
  root.classList.toggle("dark-mode");
  localStorage.setItem("theme", root.classList.contains("dark-mode") ? "dark" : "light");
  syncDarkmodeIcon();
}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const storedTheme = localStorage.getItem("theme");
if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
  root.classList.add("dark-mode");
} else {
  root.classList.remove("dark-mode");
}

syncDarkmodeIcon();

// ============================
// IDIOMA (data-lang en <html>)
// ============================

const langButtons = document.querySelectorAll(".lang-btn");

function applyLanguage(lang) {
  root.lang = lang;
  root.setAttribute("data-lang", lang);

  langButtons.forEach((btn) => {
    const isActive = btn.getAttribute("data-lang") === lang;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  localStorage.setItem("selectedLanguage", lang);
  syncDarkmodeIcon();
  syncMenuToggleAria();
}

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.getAttribute("data-lang"));
  });
});

// ============================
// MENÚ MÓVIL
// ============================

const menuToggle = document.getElementById("menu-toggle");
const navBackdrop = document.getElementById("nav-backdrop");

function setNavOpen(open) {
  document.body.classList.toggle("nav-open", open);
  if (menuToggle) menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  if (navBackdrop) navBackdrop.hidden = !open;
}

function syncMenuToggleAria() {
  if (!menuToggle) return;
  const lang = localStorage.getItem("selectedLanguage") || "es";
  const open = document.body.classList.contains("nav-open");
  menuToggle.setAttribute(
    "aria-label",
    open
      ? lang === "es"
        ? "Cerrar menú"
        : "Close menu"
      : lang === "es"
        ? "Abrir menú"
        : "Open menu"
  );
}

function initMobileNav() {
  if (!menuToggle) return;

  menuToggle.addEventListener("click", () => {
    const next = !document.body.classList.contains("nav-open");
    setNavOpen(next);
    syncMenuToggleAria();
  });

  if (navBackdrop) {
    navBackdrop.addEventListener("click", () => {
      setNavOpen(false);
      syncMenuToggleAria();
    });
  }

  document.querySelectorAll("#site-navigation .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 640px)").matches) {
        setNavOpen(false);
        syncMenuToggleAria();
      }
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
      setNavOpen(false);
      syncMenuToggleAria();
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 641px)").matches) {
      setNavOpen(false);
      syncMenuToggleAria();
    }
  });

  syncMenuToggleAria();
}

// ============================
// FOOTER: AÑO
// ============================

const yearEl = document.getElementById("footer-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================
// SCROLL REVEAL + SKILL BARS
// ============================

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll(".section-reveal").forEach((el) => revealObserver.observe(el));
document.querySelectorAll(".skill-card").forEach((el) => skillObserver.observe(el));

// ============================
// FORMULARIO
// ============================

const form = document.querySelector("#contact-form");
const submitBtn = document.getElementById("submit-btn");
const formMessageEl = document.getElementById("form-message");
let formMessageHideTimer = null;

function showFormMessage(text, type) {
  if (!formMessageEl) return;
  if (formMessageHideTimer) {
    clearTimeout(formMessageHideTimer);
    formMessageHideTimer = null;
  }
  formMessageEl.textContent = text;
  formMessageEl.className = `form-message ${type}`;
  formMessageEl.classList.remove("form-message--hidden");
  formMessageHideTimer = setTimeout(() => {
    formMessageEl.classList.add("form-message--hidden");
    formMessageHideTimer = null;
  }, 6000);
}

function getMessages() {
  const lang = localStorage.getItem("selectedLanguage") || "es";
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
    },
  };
  return msgs[lang] || msgs.es;
}

if (form && submitBtn) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const m = getMessages();

    const nombre = form.nombre.value.trim();
    const apellido = form.apellido.value.trim();
    const email = form.email.value.trim();
    const asunto = form.asunto.value.trim();
    const mensaje = form.mensaje.value.trim();
    const archivo = form.archivo.files[0];

    if (!nombre || !apellido || !email || !asunto || !mensaje) {
      showFormMessage(m.required, "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormMessage(m.email, "error");
      return;
    }

    if (archivo) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (archivo.size > 5 * 1024 * 1024) {
        showFormMessage(m.fileSize, "error");
        return;
      }
      if (!allowedTypes.includes(archivo.type)) {
        showFormMessage(m.fileType, "error");
        return;
      }
    }

    if (typeof grecaptcha !== "undefined" && !grecaptcha.getResponse()) {
      showFormMessage(m.recaptcha, "error");
      return;
    }

    submitBtn.disabled = true;
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>${m.sending}</span>`;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
      });

      if (response.ok) {
        showFormMessage(m.success, "success");
        form.reset();
        if (typeof grecaptcha !== "undefined") grecaptcha.reset();
      } else {
        showFormMessage(m.error, "error");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      showFormMessage(m.network, "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
    }
  });
}

// ============================
// INIT
// ============================

const darkBtn = document.getElementById("toggle-darkmode");
if (darkBtn) darkBtn.addEventListener("click", toggleDarkMode);

window.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("selectedLanguage") || "es";
  applyLanguage(savedLang);
  initMobileNav();
});
