# Site de Casamento — João Paulo & Nathaly Silva

Site estático (HTML + CSS + JS puro) do casamento, com confirmação de
presença, lista de presentes com pagamento via PIX ou cartão (Mercado
Pago) e mural de recados. O banco de dados fica no Supabase.

## Estrutura do projeto

```
.
├── index.html                          → Página única do site
├── style.css                           → Todo o visual do site
├── js/                                 → JavaScript separado por tema
│   ├── config.js                       → Config do Supabase + chamadas à API (fetch)
│   ├── utils.js                        → Funções utilitárias (escapeHtml, datas, preços)
│   ├── gifts-data.js                   → Lista de presentes (edite aqui para add/remover)
│   ├── rules-data.js                   → Cards da seção "Informações" (edite aqui)
│   ├── countdown.js                    → Contagem regressiva
│   ├── navigation.js                   → Menu hambúrguer / rolagem
│   ├── rules.js                        → Renderiza os cards de "Informações"
│   ├── gifts.js                        → Modal de presente + tela "Lista de Presentes"
│   ├── payment.js                      → Pagamento com cartão (Mercado Pago) + modal PIX
│   ├── presenca.js                     → Modal de confirmação de presença (RSVP)
│   ├── recados.js                      → Mural de recados
│   └── main.js                         → Atalhos de teclado, botão "voltar ao topo", init geral
├── img/                                → Pasta vazia — veja img/LEIA-ME.txt
├── supabase/
│   └── functions/
│       └── create-payment-preference/
│           └── index.ts                → Edge Function (gera o link de pagamento no Mercado Pago)
└── .env.example                        → Modelo das variáveis usadas pela Edge Function
```

Os arquivos `.js` são carregados como `<script>` simples (sem bundler),
na ordem certa já configurada em `index.html`. Isso significa que
todos compartilham o mesmo escopo global — por isso a ordem dos
`<script>` no `index.html` importa e não deve ser alterada.

## Como configurar

### 1. Supabase (frontend)

Em `js/config.js`, edite:
  

A chave "anon" é pública por design (protegida pelas regras de RLS do
banco), por isso pode ficar direto no código do site — não é a mesma
coisa que o Access Token do Mercado Pago, que fica só no servidor.

### 2. Tabelas esperadas no Supabase

O código já assume estas tabelas (crie-as no editor de tabelas do
Supabase, com RLS habilitado e políticas de SELECT/INSERT liberadas
para o público, já que é um site sem login):

**`convidados`**
| coluna | tipo      |
|--------|-----------|
| nome   | text      |

**`presencas`**
| coluna         | tipo                  |
|----------------|-----------------------|
| nome           | text                  |
| confirmado     | bool                  |
| acompanhantes  | text[] (array)        |

**`recados`**
| coluna       | tipo                          |
|--------------|-------------------------------|
| nome         | text                          |
| mensagem     | text                          |
| created_at   | timestamptz (default: now())  |

### 3. Edge Function (pagamento com cartão)

O Access Token do Mercado Pago **nunca** vai no site — ele fica só na
Edge Function, configurado como *secret*. Veja `.env.example` para o
passo a passo (via `supabase secrets set` ou pelo painel do Supabase).

Para publicar a função:

```bash
supabase functions deploy create-payment-preference
```

### 4. Imagens

Veja `img/LEIA-ME.txt` — lista exatamente quais arquivos (fotos,
imagens dos presentes e QR Codes PIX) precisam ser colocados na pasta,
com os nomes exatos que o código já espera.

### 5. PIX

Agora cada presente tem sua **própria** chave/código PIX, definida
junto com o resto dos dados do presente em `js/gifts-data.js`:

```js
{
  name: 'Remédio para a ressaca do noivo',
  price: 'R$ 60,00',
  img: './img/remedio.png',
  qrCode: './img/qr_invalido.png',
  pix: 'COLE-AQUI-O-CODIGO-PIX-COPIA-E-COLA-DESTE-VALOR'   // ← troque por presente
}
```

Edite o campo `pix` de cada item com o código "PIX Copia e Cola" (ou a
chave PIX) gerado para aquele valor específico — o mesmo código que
corresponde ao QR Code (`qrCode`) daquele presente. Assim, o texto
mostrado no modal e o botão "Copiar chave PIX" batem com o QR Code
exibido para cada presente.

Se algum presente ficar sem o campo `pix` preenchido, o site usa como
reserva a chave definida em `js/gifts.js`:

```js
const PIX_KEY_PADRAO = 'joaonathaly@email.com';
```

Troque esse valor padrão também, ou garanta que todo item em
`gifts-data.js` tenha seu próprio `pix` preenchido.

## Hospedagem

Por ser um site 100% estático, pode ser publicado em qualquer serviço
de hospedagem estática (Netlify, Vercel, GitHub Pages, Cloudflare
Pages, etc.). Depois de publicar, atualize:
- `SITE_URL` no secret da Edge Function (usado nos links de retorno do pagamento);
- as tags `og:url` e `og:image` no `<head>` do `index.html`.

## Sobre a paleta de cores

As variáveis de cor em `style.css` foram renomeadas para bater com as
cores reais usadas (o site é todo em tons de azul/marinho): o que
antes era `--gold`, `--gold-light`, `--rose`, `--rose-deep` e
`--rose-soft` agora é `--blue`, `--blue-light`, `--blue-mid`,
`--blue-deep` e `--blue-soft`. A classe `.gold-line` também virou
`.blue-line`. Nenhuma cor visual mudou — só os nomes, para não
confundir na hora de editar.

Também foram removidas algumas variáveis CSS e regras que não eram
mais usadas em nenhum lugar do HTML/JS (aliases de compatibilidade
sem uso e estilos de um monograma que não existe mais no layout).