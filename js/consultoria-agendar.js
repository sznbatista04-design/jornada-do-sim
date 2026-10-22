/* ==========================================================================
   PÁGINA DE BOAS-VINDAS (depois do pagamento) — comportamento
   ========================================================================== */

/* --------------------------------------------------------------------------
   1) NÚMERO DO WHATSAPP  ← TROQUE AQUI (só neste lugar)
   Formato: código do país + DDD + número, sem espaços, "+" ou traço.
   -------------------------------------------------------------------------- */
const WHATSAPP_NUMERO = "5599999999999";
const MENSAGEM_AJUDA = "Oi, Gabi! Acabei de pagar a consultoria individual e preciso de ajuda para agendar.";

/* --------------------------------------------------------------------------
   2) LINK DA AGENDA (Cal.com)  ← COLE AQUI quando o Cal.com estiver pronto
   Exemplo: "https://cal.com/gabriella/consultoria-individual"
   Enquanto estiver vazio, a página mostra a prévia da agenda.
   -------------------------------------------------------------------------- */
const CAL_LINK = "";

/* ---- Botões de WhatsApp ---- */
document.querySelectorAll(".js-whatsapp").forEach(function (b) {
  b.setAttribute("href", "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(MENSAGEM_AJUDA));
  b.setAttribute("target", "_blank");
  b.setAttribute("rel", "noopener");
});

/* ---- Agenda embutida ---- */
(function () {
  var caixa = document.getElementById("agenda");
  if (!caixa || !CAL_LINK) return;

  /* Segurança: só aceita endereço do Cal.com (cal.com ou app.cal.com), em https.
     Se alguém colar um endereço errado ou estranho, a agenda NÃO é exibida. */
  if (!/^https:\/\/(app\.)?cal\.com\/[A-Za-z0-9._\-\/]+(\?[^\s"'<>]*)?$/.test(CAL_LINK)) {
    console.warn("CAL_LINK inválido: use o endereço da sua agenda no Cal.com (https://cal.com/...).");
    return;
  }

  var url = CAL_LINK + (CAL_LINK.indexOf("?") === -1 ? "?" : "&") + "embed=true&theme=light";
  var frame = document.createElement("iframe");
  frame.className = "agenda-frame";
  frame.src = url;
  frame.title = "Agenda da Gabi: escolha o dia e o horário";
  frame.loading = "lazy";
  frame.referrerPolicy = "strict-origin-when-cross-origin";
  caixa.innerHTML = "";
  caixa.appendChild(frame);

  var alt = document.getElementById("agendaAlt");
  var link = document.getElementById("agendaAltLink");
  if (alt && link) { link.setAttribute("href", CAL_LINK); alt.hidden = false; }
})();

/* ---- Aparecer suave ao rolar (com rede de segurança) ---- */
(function () {
  var alvos = document.querySelectorAll(".reveal, .stagger");
  var detectou = false;
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function mostrarTudo() { alvos.forEach(function (el) { el.classList.add("in-view"); }); }

  if (!("IntersectionObserver" in window) || reduz) { mostrarTudo(); return; }
  var obs = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      detectou = true;
      if (e.isIntersecting) { e.target.classList.add("in-view"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  alvos.forEach(function (el) { obs.observe(el); });
  setTimeout(function () { if (!detectou) mostrarTudo(); }, 4000);
})();
