// ════════════════════════════════════════════════════════════
// Edge Function: create-payment-preference
// Cria uma "preferência de pagamento" no Mercado Pago e devolve
// o link de checkout (init_point) para o site redirecionar o
// convidado. O Access Token do Mercado Pago fica só aqui, do
// lado do servidor — nunca é exposto no HTML/JS do site.
// ════════════════════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
// URL do seu site publicado (troque pelo domínio real depois de publicar)
const SITE_URL = Deno.env.get("SITE_URL") ?? "https://seusite.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Requisição de "preflight" do navegador (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!MP_ACCESS_TOKEN) {
    console.error("MP_ACCESS_TOKEN não configurado nos secrets da função.");
    return new Response(
      JSON.stringify({ error: "Configuração de pagamento ausente no servidor." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { title, price } = await req.json();

    if (!title || typeof title !== "string" || typeof price !== "number" || !(price > 0)) {
      return new Response(JSON.stringify({ error: "Dados de pagamento inválidos." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Arredonda para 2 casas decimais e limita o tamanho do título
    const valor = Math.round(price * 100) / 100;
    const tituloSeguro = title.slice(0, 200);

    const preference = {
      items: [
        {
          title: tituloSeguro,
          quantity: 1,
          currency_id: "BRL",
          unit_price: valor,
        },
      ],
      back_urls: {
        success: `${SITE_URL}?pagamento=sucesso`,
        failure: `${SITE_URL}?pagamento=falha`,
        pending: `${SITE_URL}?pagamento=pendente`,
      },
      auto_return: "approved",
      statement_descriptor: "CASAMENTOJPN", // <- ajustado: máximo 13 caracteres
    };

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    const data = await mpRes.json();

    if (!mpRes.ok) {
      console.error("Erro ao criar preferência no Mercado Pago:", data);
      return new Response(
        JSON.stringify({ error: "Erro ao criar preferência de pagamento." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // init_point = checkout de produção · sandbox_init_point = checkout de teste
    return new Response(
      JSON.stringify({ init_point: data.init_point, sandbox_init_point: data.sandbox_init_point }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Erro interno na função create-payment-preference:", err);
    return new Response(JSON.stringify({ error: "Erro interno no servidor." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});