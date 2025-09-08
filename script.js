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

