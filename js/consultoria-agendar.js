/* ==========================================================================
   PÁGINA DE BOAS-VINDAS (depois do pagamento) — comportamento

   Por segurança, esta página NÃO mostra a agenda. O link da agenda é enviado
   por e-mail/WhatsApp somente a quem teve o pagamento confirmado.
   ========================================================================== */

/* --------------------------------------------------------------------------
   NÚMERO DO WHATSAPP  ← TROQUE AQUI (só neste lugar)
   Formato: código do país + DDD + número, sem espaços, "+" ou traço.
   -------------------------------------------------------------------------- */
const WHATSAPP_NUMERO = "5599999999999";
const MENSAGEM_AJUDA = "Oi, Gabi! Acabei de pagar a consultoria individual e ainda não recebi o link da agenda.";

/* ---- Botões de WhatsApp ---- */
document.querySelectorAll(".js-whatsapp").forEach(function (b) {
  b.setAttribute("href", "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(MENSAGEM_AJUDA));
  b.setAttribute("target", "_blank");
  b.setAttribute("rel", "noopener");
});

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
