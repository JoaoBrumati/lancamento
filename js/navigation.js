
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navMenu     = document.getElementById('nav-menu');
const navOverlay  = document.getElementById('nav-overlay');
const navLinks    = document.querySelectorAll('.nav-link');
const sections    = document.querySelectorAll('section[id]');

function openMenu() {
  hamburger.classList.add('open');
  navMenu.classList.add('open');
  navOverlay.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  travarScrollBody();
}

function closeMenu() {
  hamburger.classList.remove('open');
  navMenu.classList.remove('open');
  navOverlay.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  destravarScrollBodySeNadaAberto();
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

navOverlay.addEventListener('click', closeMenu);

// Fecha o menu ao clicar em qualquer link (exceto presença, que tem modal)
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    if (link.id !== 'presenca-link' && link.id !== 'presentes-link' && link.id !== 'recados-link') {
      closeMenu();
    }
  });
});

// Scroll: fundo da navbar + link ativo
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});