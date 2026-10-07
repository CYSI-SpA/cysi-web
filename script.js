const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('mainNav');
const year = document.getElementById('year');

if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

if (year) year.textContent = new Date().getFullYear();

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

sections.forEach(section => observer.observe(section));
