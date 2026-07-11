
const modalOverlay = document.getElementById('modal');
const pixModalOverlay = document.getElementById('pix-modal');


const PIX_KEY_PADRAO = 'joaonathaly@email.com';

let currentGift = null;

function openModal(gift) {
  currentGift = gift;
  document.getElementById('modal-img').src          = gift.img;
  document.getElementById('modal-img').alt          = gift.name;
  document.getElementById('modal-name').textContent  = gift.name;
  document.getElementById('modal-desc').textContent  = gift.desc;
  document.getElementById('modal-price').textContent = gift.price;

  document.getElementById('card-feedback').textContent = '';
  const valorLivreGroup = document.getElementById('modal-valor-livre-group');
  const valorLivreInput = document.getElementById('modal-valor-livre');
  const ehValorLivre = gift.price === 'Qualquer quantia';
  valorLivreGroup.style.display = ehValorLivre ? 'block' : 'none';
  valorLivreInput.value = '';

  const cardBtn = document.getElementById('modal-card-btn');
  cardBtn.disabled = false;
  cardBtn.textContent = '';
  cardBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg> Pagar com Cartão`;

  modalOverlay.classList.add('open');
  travarScrollBody();
}


// ════════════════════════════════
// TELA — LISTA DE PRESENTES
// ════════════════════════════════
const presentesPage   = document.getElementById('presentes-page');
const presentesVoltar = document.getElementById('presentes-voltar');
const presentesGrid   = document.getElementById('presentes-grid');

function renderGifts() {
  presentesGrid.innerHTML = '';
  gifts.forEach(gift => {
    const card = document.createElement('div');
    card.classList.add('gift-card');
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Ver detalhes de ${gift.name}`);
    card.addEventListener('click', () => openModal(gift));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(gift);
      }
    });

    card.innerHTML = `
      <img class="gift-img" src="${gift.img}" alt="${gift.name}" loading="lazy">
      <div class="gift-info">
        <p class="gift-name">${gift.name}</p>
        <p class="gift-desc">${gift.desc}</p>
        <div class="gift-footer">
          <span class="gift-price">${gift.price}</span>
          <button class="gift-btn" aria-hidden="true">Presentear</button>
        </div>
      </div>
    `;

    presentesGrid.appendChild(card);
  });
}

function openPresentesPage(e) {
  if (e) e.preventDefault();
  closeMenu();
  presentesPage.classList.add('open');
  travarScrollBody();
  // Se ainda não renderizou, renderiza
  if (!presentesGrid.children.length) renderGifts();
}

function closePresentesPage() {
  presentesPage.classList.remove('open');
  destravarScrollBodySeNadaAberto();
}

// Link do menu "Lista de Presentes"
document.getElementById('presentes-link').addEventListener('click', openPresentesPage);
// Botão "Ver lista completa" na seção
document.getElementById('abrir-lista-presentes').addEventListener('click', openPresentesPage);
// Botão voltar
presentesVoltar.addEventListener('click', closePresentesPage);