/* ==========================================================================
   ASSESSORIA INDIVIDUAL — comportamento da página
   ========================================================================== */

/* --------------------------------------------------------------------------
   1) NÚMERO DO WHATSAPP  ← TROQUE AQUI (só neste lugar)

   Formato: código do país + DDD + número, sem espaços, sem "+", sem traço.
   Exemplo para um celular de São Paulo: 5511998765432
                                          55  11  998765432
   Enquanto estiver com o número de exemplo abaixo, os botões abrem
   uma conversa "vazia" — troque antes de divulgar a página.
   -------------------------------------------------------------------------- */
const WHATSAPP_NUMERO = "5599999999999";

/* Mensagem que já vem escrita quando a noiva abre o WhatsApp */
const MENSAGEM_PADRAO = "Oi, Gabi! Quero agendar a assessoria individual.";

/* --------------------------------------------------------------------------
   2) Monta os links de WhatsApp em todos os botões com a classe "js-whatsapp".
   Se o botão tiver um atributo data-plano (ex: "pacote de 3 sessões"),
   a mensagem fica mais específica.
   -------------------------------------------------------------------------- */
document.querySelectorAll(".js-whatsapp").forEach(function (botao) {
  var plano = botao.getAttribute("data-plano");
  var texto = plano
    ? "Oi, Gabi! Quero agendar a assessoria individual (" + plano + ")."
    : MENSAGEM_PADRAO;

  botao.setAttribute(
    "href",
    "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(texto)
  );
  botao.setAttribute("target", "_blank");
  botao.setAttribute("rel", "noopener");
});

/* --------------------------------------------------------------------------
   3) Efeito de "aparecer suave" conforme a pessoa rola a página.
   Marca as seções com a classe .reveal e as revela quando entram na tela.
   Failsafe: se algo falhar, tudo fica visível depois de 2,5s.
   -------------------------------------------------------------------------- */
var alvos = document.querySelectorAll(
  ".para-voce .container, .como-funciona .container, .temas .container, " +
  ".beneficios .container, .quem-sou-grid, .planos .container, .faq .container, .final-cta .container"
);

alvos.forEach(function (el) { el.classList.add("reveal"); });

if ("IntersectionObserver" in window) {
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("in-view");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });

  alvos.forEach(function (el) { observador.observe(el); });
} else {
  alvos.forEach(function (el) { el.classList.add("in-view"); });
}

setTimeout(function () {
  alvos.forEach(function (el) { el.classList.add("in-view"); });
}, 2500);
