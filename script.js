// Por ahora simple, puedes agregar animaciones o scroll suave
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    // Guarda la preferencia en localStorage
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

// Mantiene el tema al recargar la página
window.onload = () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
};
