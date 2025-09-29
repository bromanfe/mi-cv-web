// ============================
// Modo oscuro
// ============================

// Detecta preferencia del sistema
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Aplica modo oscuro si no hay preferencia guardada
if (!localStorage.getItem("theme") && prefersDark) {
    document.body.classList.add("dark-mode");
}

// Mantiene la preferencia guardada
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

// Función para toggle de modo oscuro con cambio de icono
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    const icon = document.getElementById("darkmode-icon");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        icon.textContent = "☀️"; // icono modo claro
    } else {
        localStorage.setItem("theme", "light");
        icon.textContent = "🌙"; // icono modo oscuro
    }
}

// Agrega transición suave al cargar la página
window.onload = () => {
    document.body.style.transition = "background-color 0.4s, color 0.4s";
};

// ============================
// Formulario: mensaje emergente + validación + reCAPTCHA
// ============================
const form = document.getElementById('contact-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validación campos obligatorios
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const asunto = document.getElementById('asunto').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (!nombre || !apellido || !email || !asunto || !mensaje) {
        alert("Por favor completa todos los campos obligatorios.");
        return;
    }

    // Validación reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        alert("Por favor completa el reCAPTCHA antes de enviar.");
        return;
    }

    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert("¡Gracias! Tu mensaje ha sido enviado correctamente.");
            form.reset();
            grecaptcha.reset(); // Reinicia reCAPTCHA
        } else {
            alert("Error al enviar el formulario. Por favor, intenta nuevamente.");
        }
    } catch (error) {
        alert("Error de conexión. Por favor, intenta nuevamente.");
        console.error(error);
    }
});
