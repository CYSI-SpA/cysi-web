const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const year = document.getElementById('year');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });
}

if (year) year.textContent = new Date().getFullYear();
