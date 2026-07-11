

const SUPABASE_URL    = 'https://gfdqntrxcqedisdjmndm.supabase.co';         
const SUPABASE_ANON   = 'sb_publishable_NPwfBjfEsUlD2xBZo6fvvA_TwRFg-QG';  

async function buscarNomesConfirmados() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/presencas?select=nome,acompanhantes`, {
      headers: {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`
      }
    });
    const body = await res.json();
    console.log('[Supabase] status:', res.status, '| resposta:', body);
    if (!res.ok) {
      console.warn('[Supabase] SELECT bloqueado — verifique RLS policy para SELECT');
      return new Set();
    }
    const confirmados = new Set();
    body.forEach(row => {
      confirmados.add(row.nome);
      if (Array.isArray(row.acompanhantes)) {
        row.acompanhantes.forEach(n => confirmados.add(n));
      }
    });
    console.log('[Supabase] Nomes já confirmados:', [...confirmados]);
    return confirmados;
  } catch(e) {
    console.error('[Supabase] Erro ao buscar confirmados:', e);
    return new Set();
  }
}

async function salvarPresenca(payload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/presencas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error('Supabase error:', res.status, errText);
    throw new Error(`${res.status}: ${errText}`);
  }
}

async function buscarRecados() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/recados?select=nome,mensagem,created_at&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`
      }
    });
    const body = await res.json();
    console.log('[Supabase] recados status:', res.status, '| resposta:', body);
    if (!res.ok) {
      console.warn('[Supabase] SELECT recados bloqueado — verifique RLS policy para SELECT');
      return [];
    }
    return body;
  } catch (e) {
    console.error('[Supabase] Erro ao buscar recados:', e);
    return [];
  }
}

async function salvarRecado(payload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/recados`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error('Supabase error (recados):', res.status, errText);
    throw new Error(`${res.status}: ${errText}`);
  }
}

// ════════════════════════════════
// LISTA DE CONVIDADOS
// Agora vive só no Supabase (tabela "convidados"), nunca mais no código-fonte.
// Isso evita expor a lista completa de convidados a qualquer pessoa que
// abrir o "Ver código-fonte" da página, e permite adicionar/remover nomes
// direto no painel do Supabase sem precisar mexer e republicar o site.
// ════════════════════════════════
let CONVIDADOS = [];

async function buscarConvidados() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/convidados?select=nome&order=nome.asc`, {
      headers: {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`
      }
    });
    const body = await res.json();
    if (!res.ok) {
      console.warn('[Supabase] SELECT convidados bloqueado — verifique RLS policy para SELECT');
      return [];
    }
    return body.map(row => row.nome);
  } catch (e) {
    console.error('[Supabase] Erro ao buscar convidados:', e);
    return [];
  }
}
