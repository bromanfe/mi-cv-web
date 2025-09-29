// ============================
// Modo oscuro
// ============================
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (!localStorage.getItem("theme") && prefersDark) {
    document.body.classList.add("dark-mode");
}

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const icon = document.getElementById("darkmode-icon");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        icon.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "light");
        icon.textContent = "🌙";
    }
}

window.onload = () => {
    document.body.style.transition = "background-color 0.4s, color 0.4s";
};

// ============================
// Formulario: Validación y envío con Getform + reCAPTCHA
// ============================
const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Campos
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const asunto = document.getElementById('asunto').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    const archivo = document.getElementById('archivo').files[0];

    // Validación campos obligatorios
    if (!nombre || !apellido || !email || !asunto || !mensaje) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    // Validación email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        return;
    }

    // Validación archivo (opcional)
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

    // Validación reCAPTCHA
    const recaptchaToken = grecaptcha.getResponse();
    if (!recaptchaToken) {
        alert("Por favor, completa el reCAPTCHA para enviar el formulario.");
        return;
    }

    // Preparar FormData
    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert("¡Gracias! Tu mensaje ha sido enviado.");
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
