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

document.querySelectorAll(".section-reveal").forEach((el) => revealObserver.observe(el));

// ============================
// SCROLL-SPY NAV
// ============================

const spySections = document.querySelectorAll("section[id]");
const spyLinks = document.querySelectorAll(".topbar-nav .nav-link");

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        spyLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  },
  { rootMargin: "-60px 0px -50% 0px", threshold: 0 }
);

spySections.forEach((s) => spyObserver.observe(s));

// ============================
// FORMULARIO
// ============================

const form = document.querySelector("#contact-form");
const submitBtn = document.getElementById("submit-btn");
const formMessageEl = document.getElementById("form-message");
let formMessageHideTimer = null;
const SAFE_GETFORM_HOST = "forminit.com";

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
      recaptcha: "Por favor, completa el reCAPTCHA antes de enviar.",
      notConfigured:
        "Formulario desactivado en esta versión pública. Configura el endpoint del formulario y reCAPTCHA para habilitar el envío.",
      sending: "Enviando...",
      success: "✅ Mensaje enviado correctamente. ¡Gracias por contactarme!",
      error: "⚠️ Ocurrió un error al enviar. Intenta nuevamente.",
      network: "❌ No se pudo enviar. Verifica tu conexión e intenta otra vez.",
    },
    en: {
      required: "Please fill in all required fields.",
      email: "Please enter a valid email address.",
      recaptcha: "Please complete the reCAPTCHA before sending.",
      notConfigured:
        "Form disabled in this public version. Configure the form endpoint and reCAPTCHA to enable sending.",
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

    // Evita que un cambio del atributo action (por inyección/edición DOM) envíe datos a otro destino.
    let actionUrl = null;
    try {
      actionUrl = new URL(form.action);
    } catch (_) {
      actionUrl = null;
    }

    const looksLikeGetform =
      actionUrl &&
      actionUrl.protocol === "https:" &&
      actionUrl.hostname === SAFE_GETFORM_HOST &&
      actionUrl.pathname.startsWith("/f/") &&
      actionUrl.pathname.length > "/f/".length;

    if (!looksLikeGetform) {
      showFormMessage(m.error, "error");
      return;
    }

    // Si el repo está público con placeholders, no intentes enviar (evita 404 + reduce spam).
    if (actionUrl.pathname.includes("YOUR_FORM_ID")) {
      showFormMessage(m.notConfigured, "error");
      return;
    }

    const nombre = form.nombre.value.trim();
    const apellido = form.apellido.value.trim();
    const email = form.email.value.trim();
    const asunto = form.asunto.value.trim();
    const mensaje = form.mensaje.value.trim();

    if (!nombre || !apellido || !email || !asunto || !mensaje) {
      showFormMessage(m.required, "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormMessage(m.email, "error");
      return;
    }

    const recaptchaEl = document.querySelector(".g-recaptcha");
    const sitekey = recaptchaEl ? recaptchaEl.getAttribute("data-sitekey") : null;
    if (sitekey === "YOUR_RECAPTCHA_SITE_KEY") {
      showFormMessage(m.notConfigured, "error");
      return;
    }

    if (typeof grecaptcha !== "undefined" && !grecaptcha.getResponse()) {
      showFormMessage(m.recaptcha, "error");
      return;
    }

    submitBtn.disabled = true;
    const originalHTML = submitBtn.innerHTML;
    submitBtn.textContent = m.sending;

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

const topbarEl = document.querySelector(".topbar");
window.addEventListener("scroll", () => {
  if (topbarEl) topbarEl.classList.toggle("topbar--scrolled", window.scrollY > 10);
}, { passive: true });

window.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("selectedLanguage") || "es";
  applyLanguage(savedLang);
  initMobileNav();
});
