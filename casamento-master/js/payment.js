
const MP_CHECKOUT_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/create-payment-preference`;


async function pagarComCartao(gift, novaAba) {
  const feedback = document.getElementById('card-feedback');
  const cardBtn  = document.getElementById('modal-card-btn');
  feedback.textContent = '';

  let valor;
  if (gift.price === 'Qualquer quantia') {
    const input = document.getElementById('modal-valor-livre');
    valor = parseFloat(input.value.replace(',', '.'));
    if (!valor || valor <= 0) {
      feedback.textContent = 'Por favor, digite um valor válido.';
      if (novaAba && !novaAba.closed) novaAba.close();
      return;
    }
  } else {
    valor = parsePrecoBRL(gift.price);
    if (!valor) {
      feedback.textContent = 'Não foi possível calcular o valor deste presente.';
      if (novaAba && !novaAba.closed) novaAba.close();
      return;
    }
  }

  cardBtn.disabled = true;
  cardBtn.textContent = 'Gerando pagamento...';
  feedback.textContent = '';

  // Enquanto a preferência de pagamento é criada, mostra uma mensagem
  // simples na aba nova (evita ficar com uma aba em branco por 1-2s)
  if (novaAba && !novaAba.closed) {
    try {
      novaAba.document.write('<p style="font-family:sans-serif;padding:24px;color:#333;">Preparando pagamento…</p>');
    } catch (e) { /* alguns navegadores bloqueiam escrever na aba, sem problema */ }
  }

  try {
    const res = await fetch(MP_CHECKOUT_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`
      },
      body: JSON.stringify({ title: gift.name, price: valor })
    });

    const data = await res.json();

    if (!res.ok || !data.init_point) {
      throw new Error(data.error || 'Não foi possível iniciar o pagamento.');
    }

    // Leva o convidado para o checkout seguro do Mercado Pago.
    // Preferimos abrir em uma aba nova (aberta no momento do clique,
    // logo abaixo) em vez de navegar na mesma aba: assim o convidado
    // não perde a página do site, e evita que o app do banco
    // "sequestre" a navegação em alguns celulares.
    if (novaAba && !novaAba.closed) {
      novaAba.location.href = data.init_point;
    } else {
      // Bloqueador de pop-up impediu a aba nova — cai para o
      // comportamento antigo (redireciona a própria aba).
      window.location.href = data.init_point;
    }

    cardBtn.disabled = false;
    cardBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg> Pagar com Cartão`;
  } catch (err) {
    console.error('[Mercado Pago] erro:', err);
    feedback.textContent = 'Ocorreu um erro ao iniciar o pagamento. Tente novamente em instantes.';
    if (novaAba && !novaAba.closed) novaAba.close();
    cardBtn.disabled = false;
    cardBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg> Pagar com Cartão`;
  }
}

document.getElementById('modal-card-btn').addEventListener('click', () => {
  if (currentGift) {
    // Precisa abrir a aba AQUI, de forma síncrona dentro do clique,
    // senão o navegador (principalmente no celular) bloqueia como pop-up.
    const novaAba = window.open('', '_blank');
    pagarComCartao(currentGift, novaAba);
  }
});

// Mostra uma faixa no topo quando o usuário volta do checkout do Mercado Pago
function verificarRetornoPagamento() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('pagamento');
  if (!status) return;

  const banner = document.getElementById('payment-status-banner');
  const mensagens = {
    sucesso:  '💛 Pagamento aprovado! Muito obrigado pelo carinho e pelo presente!',
    pendente: '⏳ Seu pagamento está sendo processado. Assim que for aprovado, ficará tudo certo!',
    falha:    '⚠️ Não foi possível concluir o pagamento. Você pode tentar novamente ou usar o PIX.'
  };
  if (!mensagens[status]) return;

  banner.textContent = mensagens[status];
  banner.className = `payment-status-banner show ${status}`;

  // Limpa o parâmetro da URL para não reaparecer ao atualizar a página
  params.delete('pagamento');
  const novaUrl = window.location.pathname + (params.toString() ? `?${params}` : '') + window.location.hash;
  window.history.replaceState({}, '', novaUrl);

  setTimeout(() => banner.classList.remove('show'), 8000);
}

verificarRetornoPagamento();

function closeModal() {
  modalOverlay.classList.remove('open');
  destravarScrollBodySeNadaAberto();
}

function openPixModal(gift) {
  document.getElementById('pix-gift-name').textContent  = gift.name;
  document.getElementById('pix-gift-price').textContent = gift.price;

  const qrImg = document.getElementById('pix-qr-img');
  qrImg.src = gift.qrCode || './img/qr_code.svg';
  qrImg.alt = `QR Code para presentear ${gift.name}`;

  document.getElementById('pix-key-display').textContent = gift.pix || PIX_KEY_PADRAO;

  const copyBtn = document.getElementById('btn-copy-pix');
  copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg> Copiar chave PIX`;
  copyBtn.classList.remove('copied');

  pixModalOverlay.classList.add('open');
  travarScrollBody();
}

function closePixModal() {
  pixModalOverlay.classList.remove('open');
  destravarScrollBodySeNadaAberto();
}

document.getElementById('modal-present-btn').addEventListener('click', () => {
  closeModal();
  if (currentGift) openPixModal(currentGift);
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.getElementById('modal-close').addEventListener('click', closeModal);

pixModalOverlay.addEventListener('click', (e) => {
  if (e.target === pixModalOverlay) closePixModal();
});
document.getElementById('pix-modal-close').addEventListener('click', closePixModal);

document.getElementById('btn-copy-pix').addEventListener('click', () => {
  const pixParaCopiar = (currentGift && currentGift.pix) || PIX_KEY_PADRAO;
  navigator.clipboard.writeText(pixParaCopiar).then(() => {
    const btn = document.getElementById('btn-copy-pix');
    btn.innerHTML = `✓ Chave copiada!`;
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg> Copiar chave PIX`;
      btn.classList.remove('copied');
    }, 3000);
  }).catch(() => {
    const el = document.createElement('textarea');
    el.value = pixParaCopiar;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    const btn = document.getElementById('btn-copy-pix');
    btn.innerHTML = `✓ Chave copiada!`;
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg> Copiar chave PIX`;
      btn.classList.remove('copied');
    }, 3000);
  });
});