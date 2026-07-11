
const recadosPage    = document.getElementById('recados-page');
const recadosLink    = document.getElementById('recados-link');
const recadosVoltar  = document.getElementById('recados-voltar');
const recadosForm    = document.getElementById('recados-form');
const recadoFeedback = document.getElementById('recado-feedback');
const recadoSubmit   = document.getElementById('recado-submit');

function renderRecados(lista) {
  const container = document.getElementById('recados-lista');
  const vazio      = document.getElementById('recados-vazio');
  const count      = document.getElementById('recados-count');

  container.querySelectorAll('.recado-card').forEach(c => c.remove());
  count.textContent = lista.length ? `(${lista.length})` : '';

  if (!lista.length) {
    vazio.style.display = 'block';
    return;
  }
  vazio.style.display = 'none';

  // A API já retorna em ordem decrescente (mais recentes primeiro)
  lista.forEach(r => {
    const card = document.createElement('div');
    card.classList.add('recado-card');
    card.innerHTML = `
      <p class="recado-nome">${escapeHtml(r.nome)}</p>
      <p class="recado-texto">${escapeHtml(r.mensagem)}</p>
      <p class="recado-data">${formatarDataRecado(r.created_at)}</p>
    `;
    container.appendChild(card);
  });
}

async function openRecadosPage(e) {
  if (e) e.preventDefault();
  closeMenu();
  recadosPage.classList.add('open');
  travarScrollBody();

  const container = document.getElementById('recados-lista');
  container.querySelectorAll('.recado-card').forEach(c => c.remove());
  document.getElementById('recados-vazio').style.display = 'none';
  const loading = document.createElement('p');
  loading.className = 'recados-loading';
  loading.id = 'recados-loading';
  loading.textContent = 'Carregando recados...';
  container.appendChild(loading);

  const lista = await buscarRecados();
  const loadingEl = document.getElementById('recados-loading');
  if (loadingEl) loadingEl.remove();
  renderRecados(lista);
}

function closeRecadosPage() {
  recadosPage.classList.remove('open');
  destravarScrollBodySeNadaAberto();
}

recadosLink.addEventListener('click', openRecadosPage);
recadosVoltar.addEventListener('click', closeRecadosPage);

recadosForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nomeInput = document.getElementById('recado-nome');
  const msgInput  = document.getElementById('recado-mensagem');
  const nome      = nomeInput.value.trim();
  const mensagem  = msgInput.value.trim();

  if (!nome || !mensagem) {
    recadoFeedback.textContent = 'Por favor, preencha seu nome e a mensagem.';
    recadoFeedback.className = 'presenca-feedback erro';
    return;
  }

  recadoSubmit.disabled = true;
  recadoFeedback.textContent = 'Enviando...';
  recadoFeedback.className = 'presenca-feedback';

  try {
    await salvarRecado({ nome, mensagem });

    recadoFeedback.textContent = `💛 Obrigado, ${nome.split(' ')[0]}! Seu recado foi publicado no mural.`;
    recadoFeedback.className = 'presenca-feedback sucesso';
    recadosForm.reset();

    const lista = await buscarRecados();
    renderRecados(lista);
  } catch (err) {
    console.error(err);
    recadoFeedback.textContent = 'Ocorreu um erro ao enviar seu recado. Tente novamente.';
    recadoFeedback.className = 'presenca-feedback erro';
  } finally {
    recadoSubmit.disabled = false;
    setTimeout(() => {
      recadoFeedback.textContent = '';
      recadoFeedback.className = 'presenca-feedback';
    }, 4000);
  }
});