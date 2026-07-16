const navbar      = document.getElementById('navbar');
const navMenu     = document.getElementById('nav-menu');
const navLinks    = document.querySelectorAll('.nav-link');
const sections    = document.querySelectorAll('section[id]');

// A navegação agora é uma barra horizontal sempre visível (sem menu
// hambúrguer). Mantemos esta função apenas para compatibilidade, já que
// outras telas (presentes, recados) chamam closeMenu() ao abrir — como
// não há mais um menu para fechar, ela não faz nada.
function closeMenu() {}

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

  let activeLink = null;
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
      activeLink = link;
    }
  });

  // No mobile o menu rola na horizontal — mantém o link ativo sempre
  // visível dentro da barra, sem precisar arrastar manualmente.
  if (activeLink) {
    const menuRect = navMenu.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const foraDaVista = linkRect.left < menuRect.left || linkRect.right > menuRect.right;
    if (foraDaVista) {
      activeLink.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }
});