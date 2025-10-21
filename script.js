// ============================
// Temas (claro, oscuro, sepia, amoled) y animaciones
// ============================
(function(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeButtons = document.querySelectorAll('.theme-option');
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme','dark');
  }
  updateThemeIcon();

  function setTheme(t){
    root.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    updateThemeIcon();
  }
  function updateThemeIcon(){
    if (!themeToggle) return;
    const t = root.getAttribute('data-theme')||'light';
    themeToggle.textContent = t==='dark'?'☀️':t==='amoled'?'🌚':t==='sepia'?'🟤':'🌙';
  }

  themeButtons.forEach(btn=>btn.addEventListener('click', ()=>setTheme(btn.dataset.theme)));
  if (themeToggle) themeToggle.addEventListener('click', ()=>{
    const order = ['light','dark','sepia','amoled'];
    const current = root.getAttribute('data-theme')||'light';
    const next = order[(order.indexOf(current)+1)%order.length];
    setTheme(next);
  });

  // Animaciones on-intersection
  const reveal = (entries, obs)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  };
  const io = new IntersectionObserver(reveal, {threshold: .12, rootMargin:'0px 0px -10% 0px'});
  document.querySelectorAll('.card, .fade-in').forEach(el=>io.observe(el));

  // Año en footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// ============================
// Formulario con validación + honeypot + feedback visual
// ============================
(function(){
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');

  function showStatus(msg, ok=true){
    if (!status) return alert(msg);
    status.textContent = msg;
    status.className = ok? 'ok' : 'error';
  }

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    // anti-spam simple (honeypot)
    if (fd.get('empresa')) { showStatus('Detectado spam.', false); return; }

    // Validaciones básicas
    const nombre = fd.get('nombre')?.toString().trim();
    const email = fd.get('email')?.toString().trim();
    const mensaje = fd.get('mensaje')?.toString().trim();
    if (!nombre || !email || !mensaje) { showStatus('Completa los campos obligatorios.', false); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showStatus('Email inválido.', false); return; }

    showStatus('Enviando…');

    try {
      // Simulación de envío (puedes conectar EmailJS/Getform/Netlify Forms)
      await new Promise(r=>setTimeout(r, 900));
      form.reset();
      showStatus('¡Gracias! Responderé pronto.', true);
    } catch(err){
      console.error(err);
      showStatus('Error al enviar. Intenta nuevamente.', false);
    }
  });
})();

// ============================
// Accesibilidad: enfoque visible y preferencia de reduce motion
// ============================
(function(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.documentElement.style.setProperty('scroll-behavior','auto');
  }
})();
