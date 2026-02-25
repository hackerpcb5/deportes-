// ===== Sistema de Modo Claro/Oscuro =====

// Función para mostrar el popup de selección de tema
window.showThemePopup = function () {
  const popup = document.getElementById('themePopup');
  if (popup) {
    popup.classList.remove('hidden');
  }
}

// Función para ocultar el popup
window.hideThemePopup = function () {
  const popup = document.getElementById('themePopup');
  if (popup) {
    popup.classList.add('hidden');
  }
}

// Función para aplicar modo claro
window.setLightMode = function () {
  document.body.classList.remove('dark-mode');
  localStorage.setItem('theme', 'light');
  hideThemePopup();
}

// Función para aplicar modo oscuro
window.setDarkMode = function () {
  document.body.classList.add('dark-mode');
  localStorage.setItem('theme', 'dark');
  hideThemePopup();
}

// Verificar si el usuario ya seleccionó un tema anteriormente
function checkThemePreference() {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    hideThemePopup();
  } else if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
    hideThemePopup();
  } else {
    // Si no hay preferencia guardada, mostrar el popup
    showThemePopup();
  }
}

// Ejecutar cuando la página cargue
document.addEventListener('DOMContentLoaded', function () {
  checkThemePreference();

  // ===== ELEMENTOS DEL MENÚ LATERAL =====
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sidebarMenu = document.getElementById('sidebarMenu');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const closeSidebar = document.getElementById('closeSidebar');
  const servicesToggle = document.getElementById('servicesToggle');
  const servicesOptions = document.getElementById('servicesOptions');
  const themeToggle = document.getElementById('themeToggle');
  const themeOptions = document.getElementById('themeOptions');
  const selectLightMode = document.getElementById('selectLightMode');
  const selectDarkMode = document.getElementById('selectDarkMode');
  const languageToggle = document.getElementById('languageToggle');
  const languageOptions = document.getElementById('languageOptions');
  const selectSpanish = document.getElementById('selectSpanish');
  const selectEnglish = document.getElementById('selectEnglish');

  // Función para cerrar el menú lateral
  function closeSidebarMenu() {
    if (sidebarMenu) sidebarMenu.classList.remove('active');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    // Cerrar todos los submenús abiertos
    if (servicesOptions) servicesOptions.style.display = 'none';
    if (themeOptions) themeOptions.style.display = 'none';
    if (languageOptions) languageOptions.style.display = 'none';
  }

  // ABRIR MENÚ LATERAL - Botón de las 3 barras en el header
  if (hamburgerBtn && sidebarMenu && sidebarOverlay) {
    hamburgerBtn.addEventListener('click', function () {
      sidebarMenu.classList.add('active');
      sidebarOverlay.classList.add('active');
    });
  }

  // Cerrar menú al hacer clic en el overlay
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebarMenu);
  }

  // Cerrar menú al hacer clic en el botón de cierre
  if (closeSidebar) {
    closeSidebar.addEventListener('click', closeSidebarMenu);
  }

  // Toggle para Servicios Digitales
  if (servicesToggle && servicesOptions) {
    servicesToggle.addEventListener('click', function () {
      const isHidden = servicesOptions.style.display === 'none' || servicesOptions.style.display === '';
      servicesOptions.style.display = isHidden ? 'block' : 'none';
      // Cerrar otros submenús
      if (themeOptions) themeOptions.style.display = 'none';
      if (languageOptions) languageOptions.style.display = 'none';
    });
  }

  // Toggle para Cambiar Tema
  if (themeToggle && themeOptions) {
    themeToggle.addEventListener('click', function () {
      const isHidden = themeOptions.style.display === 'none' || themeOptions.style.display === '';
      themeOptions.style.display = isHidden ? 'block' : 'none';
      // Cerrar otros submenús
      if (servicesOptions) servicesOptions.style.display = 'none';
      if (languageOptions) languageOptions.style.display = 'none';
    });
  }

  // Funcionalidad para Modo Claro
  if (selectLightMode) {
    selectLightMode.addEventListener('click', function () {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
      closeSidebarMenu();
    });
  }

  // Funcionalidad para Modo Oscuro
  if (selectDarkMode) {
    selectDarkMode.addEventListener('click', function () {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
      closeSidebarMenu();
    });
  }

  // Toggle para Cambiar Idioma
  if (languageToggle && languageOptions) {
    languageToggle.addEventListener('click', function () {
      const isHidden = languageOptions.style.display === 'none' || languageOptions.style.display === '';
      languageOptions.style.display = isHidden ? 'block' : 'none';
      // Cerrar otros submenús
      if (servicesOptions) servicesOptions.style.display = 'none';
      if (themeOptions) themeOptions.style.display = 'none';
    });
  }

  // Funcionalidad para Español
  if (selectSpanish) {
    selectSpanish.addEventListener('click', function () {
      localStorage.setItem('language', 'es');
      const htmlRoot = document.getElementById('htmlRoot');
      if (htmlRoot) htmlRoot.setAttribute('lang', 'es');
      if (typeof translatePage === 'function') {
        translatePage('es');
      }
      closeSidebarMenu();
    });
  }

  // Funcionalidad para Inglés
  if (selectEnglish) {
    selectEnglish.addEventListener('click', function () {
      localStorage.setItem('language', 'en');
      const htmlRoot = document.getElementById('htmlRoot');
      if (htmlRoot) htmlRoot.setAttribute('lang', 'en');
      if (typeof translatePage === 'function') {
        translatePage('en');
      }
      closeSidebarMenu();
    });
  }
});

// ===== Menú móvil =====
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });

  // Cerrar menú al hacer clic en un enlace
  const navLinks = mainNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
}

// ===== Smooth scroll para enlaces internos =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href !== '') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});
