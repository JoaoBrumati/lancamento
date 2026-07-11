
// Esc fecha qualquer modal/tela aberta
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closePixModal();
    closePresencaModal();
    closeRecadosPage();
    closePresentesPage();
  }
});

// ════════════════════════════════
// BOTÃO VOLTAR AO TOPO
// ════════════════════════════════
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 600) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ════════════════════════════════
// INICIALIZAÇÃO
// ════════════════════════════════
document.addEventListener('DOMContentLoaded', async () => {
  renderRules();
  // Carrega a lista de convidados e quem já confirmou, ambos do Supabase,
  // antes de montar o select
  [CONVIDADOS, nomesJaConfirmados] = await Promise.all([
    buscarConvidados(),
    buscarNomesConfirmados()
  ]);
  popularSelectConvidados('presenca-nome-select');
});