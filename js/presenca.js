const presencaLink    = document.getElementById('presenca-link');
const presencaModal   = document.getElementById('presenca-modal');
const presencaClose   = document.getElementById('presenca-close');
const presencaFeedback = document.getElementById('presenca-feedback');

// Estado dos acompanhantes
let acompanhantes = [];

async function openPresencaModal(e) {
  e.preventDefault();
  // Reset completo do modal
  acompanhantes = [];
  renderAcompanhantes();
  document.getElementById('presenca-feedback').textContent = '';
  document.getElementById('presenca-feedback').className = 'presenca-feedback';
  document.getElementById('presenca-acoes').style.display = 'none';
  presencaModal.classList.add('open');
  travarScrollBody();
  // Recarrega do Supabase a lista de convidados e quem já confirmou, e reconstrói o select
  [CONVIDADOS, nomesJaConfirmados] = await Promise.all([
    buscarConvidados(),
    buscarNomesConfirmados()
  ]);
  popularSelectConvidados('presenca-nome-select');
}

function closePresencaModal() {
  presencaModal.classList.remove('open');
  destravarScrollBodySeNadaAberto();
}

presencaLink.addEventListener('click', openPresencaModal);
document.getElementById('abrir-presenca').addEventListener('click', openPresencaModal);
presencaClose.addEventListener('click', closePresencaModal);
presencaModal.addEventListener('click', (e) => {
  if (e.target === presencaModal) closePresencaModal();
});

// Popula o select de convidados (filtrando já confirmados)
function popularSelectConvidados(selectId) {
  const select = document.getElementById(selectId);
  const disponiveis = CONVIDADOS.filter(n => !nomesJaConfirmados.has(n));
  select.innerHTML = '<option value="">— Selecione um nome —</option>';
  disponiveis.forEach(nome => {
    const opt = document.createElement('option');
    opt.value = nome;
    opt.textContent = nome;
    select.appendChild(opt);
  });
}

// Mostra os botões de ação ao selecionar o nome principal
document.getElementById('presenca-nome-select').addEventListener('change', function () {
  const acoes = document.getElementById('presenca-acoes');
  acoes.style.display = this.value ? 'flex' : 'none';
  document.getElementById('presenca-feedback').textContent = '';
});

// Adicionar acompanhante
document.getElementById('btn-add-acompanhante').addEventListener('click', () => {
  const id = Date.now();
  acompanhantes.push({ id, nome: '' });
  renderAcompanhantes();
});

function renderAcompanhantes() {
  const container = document.getElementById('acompanhantes-lista');
  container.innerHTML = '';

  acompanhantes.forEach((ac, index) => {
    const item = document.createElement('div');
    item.classList.add('acompanhante-item');
    item.dataset.id = ac.id;

    item.innerHTML = `
      <span class="acomp-num">${index + 1}.</span>
      <select class="acomp-select" aria-label="Nome do acompanhante ${index + 1}">
        <option value="">— Selecione o nome —</option>
        ${CONVIDADOS.map(n => `<option value="${escapeHtml(n)}" ${n === ac.nome ? 'selected' : ''}>${escapeHtml(n)}</option>`).join('')}
      </select>
      <button class="btn-remover-acomp" aria-label="Remover acompanhante ${index + 1}" data-id="${ac.id}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
      </button>
    `;

    // Evento de mudança no select do acompanhante
    item.querySelector('.acomp-select').addEventListener('change', function () {
      const found = acompanhantes.find(a => a.id === ac.id);
      if (found) found.nome = this.value;
    });

    // Evento de remover
    item.querySelector('.btn-remover-acomp').addEventListener('click', () => {
      acompanhantes = acompanhantes.filter(a => a.id !== ac.id);
      renderAcompanhantes();
    });

    container.appendChild(item);
  });
}

// Confirmar presença (IRÁ)
document.getElementById('btn-confirmar').addEventListener('click', async () => {
  await enviarPresenca(true);
});

// Não confirmar presença (NÃO IRÁ)
document.getElementById('btn-nao-confirmar').addEventListener('click', async () => {
  await enviarPresenca(false);
});

// Nomes já confirmados — carregado do Supabase
let nomesJaConfirmados = new Set();

// Atualiza todos os selects removendo nomes já confirmados
function atualizarSelectsDisponiveis() {
  const disponiveis = CONVIDADOS.filter(n => !nomesJaConfirmados.has(n));

  const sel = document.getElementById('presenca-nome-select');
  const valorAtual = sel.value;
  sel.innerHTML = '<option value="">— Selecione seu nome —</option>';
  disponiveis.forEach(n => {
    const opt = document.createElement('option');
    opt.value = n;
    opt.textContent = n;
    if (n === valorAtual) opt.selected = true;
    sel.appendChild(opt);
  });

  document.querySelectorAll('.acomp-select').forEach(asel => {
    const val = asel.value;
    asel.innerHTML = '<option value="">— Selecione o nome —</option>';
    disponiveis.forEach(n => {
      const opt = document.createElement('option');
      opt.value = n;
      opt.textContent = n;
      if (n === val) opt.selected = true;
      asel.appendChild(opt);
    });
  });
}

async function enviarPresenca(confirmado) {
  const nomeSelect = document.getElementById('presenca-nome-select');
  const nome = nomeSelect.value.trim();
  const feedback = document.getElementById('presenca-feedback');

  if (!nome) {
    feedback.textContent = 'Por favor, selecione seu nome.';
    feedback.className = 'presenca-feedback erro';
    return;
  }

  const acompInvalido = acompanhantes.some(a => !a.nome);
  if (acompInvalido) {
    feedback.textContent = 'Por favor, selecione o nome de todos os acompanhantes adicionados.';
    feedback.className = 'presenca-feedback erro';
    return;
  }

  document.getElementById('btn-confirmar').disabled = true;
  document.getElementById('btn-nao-confirmar').disabled = true;
  feedback.textContent = 'Enviando...';
  feedback.className = 'presenca-feedback';

  const payload = {
    nome,
    confirmado,
    acompanhantes: acompanhantes.map(a => a.nome)
  };

  try {
    await salvarPresenca(payload);

    // Remove nome confirmado (e acompanhantes) da lista em memória
    nomesJaConfirmados.add(nome);
    acompanhantes.forEach(a => { if (a.nome) nomesJaConfirmados.add(a.nome); });
    atualizarSelectsDisponiveis();

    if (confirmado) {
      feedback.textContent = `✅ Que alegria, ${nome.split(' ')[0]}! Sua presença foi confirmada. Mal podemos esperar para celebrar com você! 💛`;
    } else {
      feedback.textContent = `💙 Tudo bem, ${nome.split(' ')[0]}. Sentiremos sua falta! Obrigado por avisar.`;
    }
    feedback.className = 'presenca-feedback sucesso';

    setTimeout(() => {
      closePresencaModal();
      feedback.textContent = '';
      feedback.className = 'presenca-feedback';
    }, 4000);
  } catch (err) {
    console.error(err);
    feedback.textContent = `Erro: ${err.message}`;
    feedback.className = 'presenca-feedback erro';
    document.getElementById('btn-confirmar').disabled = false;
    document.getElementById('btn-nao-confirmar').disabled = false;
  }
}