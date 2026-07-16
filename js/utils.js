function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatarDataRecado(isoString) {
  const data = new Date(isoString);
  const dataStr = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const horaStr = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dataStr} às ${horaStr}`;
}

function parsePrecoBRL(precoStr) {
  // Converte "R$ 150,00" em 150.00
  const limpo = precoStr.replace('R$', '').trim().replace(/\./g, '').replace(',', '.');
  const valor = parseFloat(limpo);
  return isNaN(valor) ? null : valor;
}

// ════════════════════════════════
// TRAVA DE SCROLL DO BODY (compartilhada)
// ════════════════════════════════
// Várias telas (menu, modal de presente, modal PIX, lista de presentes,
// presença, recados) travam o scroll do body enquanto abertas. Se cada
// uma delas simplesmente destravasse ao fechar, fechar uma tela por
// cima de outra (ex: fechar o modal de presente com a Lista de
// Presentes ainda aberta atrás) destravaria o scroll da página
// principal por engano, criando dois scrolls ao mesmo tempo.
// Por isso, ao fechar qualquer tela, checamos se ainda existe alguma
// outra aberta antes de liberar o scroll do body.
function travarScrollBody() {
  document.body.style.overflow = 'hidden';
}

function destravarScrollBodySeNadaAberto() {
  const overlays = [
    typeof modalOverlay !== 'undefined' ? modalOverlay : null,
    typeof pixModalOverlay !== 'undefined' ? pixModalOverlay : null,
    typeof presentesPage !== 'undefined' ? presentesPage : null,
    typeof recadosPage !== 'undefined' ? recadosPage : null,
    typeof presencaModal !== 'undefined' ? presencaModal : null
  ];
  const algumAberto = overlays.some(el => el && el.classList.contains('open'));
  document.body.style.overflow = algumAberto ? 'hidden' : '';
}