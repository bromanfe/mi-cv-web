// Toggle dark mode
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or default to system preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
  body.classList.toggle('dark-mode', currentTheme === 'dark');
  updateThemeIcon();
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  body.classList.add('dark-mode');
  updateThemeIcon();
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
  themeToggle.style.transform = 'rotate(360deg)';
  setTimeout(() => {
    themeToggle.style.transform = 'rotate(0deg)';
  }, 300);
});

function updateThemeIcon() {
  const isDark = body.classList.contains('dark-mode');
  themeToggle.textContent = isDark ? '\u2600\uFE0F' : '\uD83C\uDF19';
}

// PDF Viewer
const openPdfBtn = document.getElementById('open-pdf');
const closePdfBtn = document.getElementById('close-pdf');
const pdfViewer = document.getElementById('pdf-viewer');

if (openPdfBtn) {
  openPdfBtn.addEventListener('click', () => {
    pdfViewer.style.display = 'block';
  });
}

if (closePdfBtn) {
  closePdfBtn.addEventListener('click', () => {
    pdfViewer.style.display = 'none';
  });
}

// Form validation and submission
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get reCAPTCHA response
    const recaptchaResponse = grecaptcha.getResponse();
    
    if (!recaptchaResponse) {
      alert('Por favor, completa el reCAPTCHA');
      return;
    }

    // Get form data
    const formData = new FormData(contactForm);
    formData.append('g-recaptcha-response', recaptchaResponse);

    try {
      // Here you would send the form data to your backend
      // For now, we'll just show a success message
      alert('Gracias por tu mensaje. Te contactar\u00e9 pronto!');
      contactForm.reset();
      grecaptcha.reset();
    } catch (error) {
      alert('Hubo un error al enviar el mensaje. Por favor, int\u00e9ntalo de nuevo.');
    }
  });
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
