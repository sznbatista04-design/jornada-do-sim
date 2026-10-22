/* ==========================================================================
   CONSULTORIA INDIVIDUAL COM GABI — versão 2 (comportamento)
   ========================================================================== */

/* --------------------------------------------------------------------------
   1) NÚMERO DO WHATSAPP  ← TROQUE AQUI (só neste lugar)
   Formato: código do país + DDD + número, sem espaços, "+" ou traço.
   Exemplo: 5511998765432
   -------------------------------------------------------------------------- */
const WHATSAPP_NUMERO = "5599999999999";
const MENSAGEM_PADRAO = "Oi, Gabi! Quero agendar a consultoria individual.";

const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Monta o link do WhatsApp de um botão (usa data-plano, se existir) */
function montarWhatsapp(botao) {
  var plano = botao.getAttribute("data-plano");
  var texto = MENSAGEM_PADRAO;
  if (plano) texto = "Oi, Gabi! Quero agendar a consultoria individual (" + plano + ").";
  botao.setAttribute("href", "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(texto));
  botao.setAttribute("target", "_blank");
  botao.setAttribute("rel", "noopener");
}
document.querySelectorAll(".js-whatsapp").forEach(montarWhatsapp);

/* --------------------------------------------------------------------------
   2) Palavra que troca sozinha no título
   -------------------------------------------------------------------------- */
(function () {
  var palavras = document.querySelectorAll(".rot-w");
  if (palavras.length < 2 || reduzMovimento) return;
  var atual = 0;
  setInterval(function () {
    var saindo = palavras[atual];
    atual = (atual + 1) % palavras.length;
    saindo.classList.remove("is-on");
    saindo.classList.add("is-out");
    palavras[atual].classList.add("is-on");
    setTimeout(function () { saindo.classList.remove("is-out"); }, 700);
  }, 2600);
})();

/* --------------------------------------------------------------------------
   3) Faixas em movimento: duplica o conteúdo para o loop ficar contínuo
   -------------------------------------------------------------------------- */
if (!reduzMovimento) {
  document.querySelectorAll(".marquee").forEach(function (m) {
    var trilho = m.querySelector(".marquee-track");
    if (!trilho) return;
    var copia = trilho.cloneNode(true);
    copia.setAttribute("aria-hidden", "true");
    copia.querySelectorAll("img").forEach(function (i) { i.alt = ""; });
    m.appendChild(copia);
  });
}

/* Fotos da galeria: só baixam quando a pessoa se aproxima da seção.
   (Evita carregar ~1 MB de fotos de uma vez no começo, o que pesa no celular.) */
(function () {
  var secao = document.querySelector(".galeria");
  function carregar() {
    /* Computador: baixa todas de uma vez, versão normal */
    if (window.matchMedia("(min-width: 760px)").matches) {
      document.querySelectorAll("img[data-src]").forEach(function (i) {
        i.src = i.getAttribute("data-src");
        i.removeAttribute("data-src");
      });
      return;
    }
    /* Celular: versões menores, baixando em fila (3 por vez, na ordem em que aparecem),
       para as primeiras fotos ficarem prontas logo em vez de todas chegarem "pela metade". */
    var trilhos = document.querySelectorAll(".marquee-photos .marquee-track");
    var originais = trilhos[0] ? trilhos[0].querySelectorAll("img[data-src]") : [];
    var copias = trilhos[1] ? trilhos[1].querySelectorAll("img[data-src]") : [];
    var fila = [];
    originais.forEach(function (img, i) { fila.push({ img: img, copia: copias[i] }); });
    var ativos = 0, MAX = 3;
    function proximo() {
      while (ativos < MAX && fila.length) {
        (function (item) {
          ativos++;
          var url = item.img.getAttribute("data-src").replace("/opt/", "/opt/m/");
          function fim() { ativos--; proximo(); }
          item.img.onload = fim;
          item.img.onerror = fim;
          item.img.src = url;
          item.img.removeAttribute("data-src");
          if (item.copia) { item.copia.src = url; item.copia.removeAttribute("data-src"); }
        })(fila.shift());
      }
    }
    proximo();
  }
  if (!secao || !("IntersectionObserver" in window)) { carregar(); return; }
  var obs = new IntersectionObserver(function (es) {
    if (es[0].isIntersecting) { carregar(); obs.disconnect(); }
  }, { rootMargin: "900px 0px" });
  obs.observe(secao);
})();

/* Faixas fora da tela ficam pausadas (poupa bateria e processamento no celular) */
(function () {
  if (!("IntersectionObserver" in window)) return;
  var obs = new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.classList.toggle("is-paused", !e.isIntersecting); });
  });
  document.querySelectorAll(".marquee").forEach(function (m) { obs.observe(m); });
})();

/* --------------------------------------------------------------------------
   4) Temas clicáveis ("Qual é a sua dúvida hoje?")
   -------------------------------------------------------------------------- */
(function () {
  var temas = [
    { nome: "Orçamento e gastos",
      texto: "Olhamos juntas para o seu orçamento, entendemos o que é prioridade para vocês e onde vale concentrar (ou economizar) cada real." },
    { nome: "Fornecedores e propostas",
      texto: "Você traz as propostas e as dúvidas; eu te ajudo a comparar, entender o que está incluso e o que perguntar antes de fechar." },
    { nome: "Lista de convidados",
      texto: "Conversamos sobre como organizar a lista, definir critérios e lidar com os impasses, sem que isso vire desgaste." },
    { nome: "Cerimônia e recepção",
      texto: "Alinhamos o formato, a ordem e os detalhes que mais fazem diferença no dia, de acordo com o que vocês sonham." },
    { nome: "Organização da reta final",
      texto: "Priorizamos o que ainda falta, na ordem certa, para você chegar ao grande dia com tranquilidade." },
    { nome: "Decisões que ainda estão em aberto",
      texto: "Qual decisão está travada? Pesamos as opções e saímos da conversa com um próximo passo claro." },
    { nome: "Qualquer questão específica",
      texto: "Trouxe algo diferente? Perfeito: a consultoria é personalizada de acordo com o que você levar para o encontro." }
  ];

  var caixa = document.getElementById("topics");
  var painel = document.getElementById("topicPanel");
  var titulo = document.getElementById("tpTitle");
  var texto = document.getElementById("tpText");
  if (!caixa || !painel) return;

  function escolher(i, animar) {
    var t = temas[i];
    caixa.querySelectorAll(".topic").forEach(function (b, j) {
      b.setAttribute("aria-pressed", j === i ? "true" : "false");
    });
    titulo.textContent = t.nome;
    texto.textContent = t.texto;
    if (animar) {
      painel.classList.remove("swap");
      void painel.offsetWidth;
      painel.classList.add("swap");
    }
  }

  temas.forEach(function (t, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "topic";
    b.textContent = t.nome;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function () { escolher(i, true); });
    caixa.appendChild(b);
  });
  escolher(0, false);
})();

/* --------------------------------------------------------------------------
   5) Aparecer suave ao rolar (.reveal e .stagger)
   Se por algum motivo nada for detectado em 4s, mostra tudo (rede de segurança).
   -------------------------------------------------------------------------- */
(function () {
  var alvos = document.querySelectorAll(".reveal, .stagger");
  var detectou = false;
  function mostrarTudo() { alvos.forEach(function (el) { el.classList.add("in-view"); }); }

  if (!("IntersectionObserver" in window) || reduzMovimento) { mostrarTudo(); return; }

  var obs = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      detectou = true;
      if (e.isIntersecting) { e.target.classList.add("in-view"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  alvos.forEach(function (el) { obs.observe(el); });
  setTimeout(function () { if (!detectou) mostrarTudo(); }, 4000);
})();

/* --------------------------------------------------------------------------
   6) Números que sobem (estatísticas)
   -------------------------------------------------------------------------- */
(function () {
  var lista = document.getElementById("stats");
  if (!lista) return;
  var numeros = lista.querySelectorAll("[data-count]");

  function animar() {
    numeros.forEach(function (el) {
      var alvo = parseInt(el.getAttribute("data-count"), 10);
      if (reduzMovimento) { el.textContent = alvo; return; }
      var inicio = null, dur = 1500;
      function passo(ts) {
        if (inicio === null) inicio = ts;
        var p = Math.min((ts - inicio) / dur, 1);
        var suave = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(alvo * suave);
        if (p < 1) requestAnimationFrame(passo);
      }
      el.textContent = "0";
      requestAnimationFrame(passo);
    });
  }

  if (!("IntersectionObserver" in window)) return;
  var obs = new IntersectionObserver(function (es) {
    if (es[0].isIntersecting) { animar(); obs.disconnect(); }
  }, { threshold: 0.4 });
  obs.observe(lista);
})();

/* --------------------------------------------------------------------------
   7) Efeitos ligados à rolagem: barra de progresso, texto que acende,
      linha do tempo e botão fixo do celular
   -------------------------------------------------------------------------- */
(function () {
  var barra = document.getElementById("progress");
  var sticky = document.getElementById("stickyCta");
  var hero = document.getElementById("topo");
  var planos = document.getElementById("investimento");
  var final = document.getElementById("final");
  var passos = document.querySelectorAll(".tl-step");

  /* Divide o texto em palavras para poder "acender" uma a uma */
  var fill = document.querySelector("[data-fill]");
  var palavras = [];
  if (fill && !reduzMovimento) {
    var partes = fill.textContent.trim().split(/\s+/);
    fill.textContent = "";
    partes.forEach(function (p, i) {
      var s = document.createElement("span");
      s.className = "w";
      s.textContent = p;
      fill.appendChild(s);
      if (i < partes.length - 1) fill.appendChild(document.createTextNode(" "));
      palavras.push(s);
    });
  }

  function visivel(el, vh) {
    var r = el.getBoundingClientRect();
    return r.top < vh && r.bottom > 0;
  }

  function atualizar() {
    var vh = window.innerHeight;
    var doc = document.documentElement;

    if (barra) {
      var total = doc.scrollHeight - vh;
      barra.style.transform = "scaleX(" + (total > 0 ? Math.min(window.scrollY / total, 1) : 0) + ")";
    }

    if (palavras.length) {
      var linha = vh * 0.72;
      palavras.forEach(function (w) {
        w.classList.toggle("lit", w.getBoundingClientRect().top < linha);
      });
    }

    if (passos.length && !reduzMovimento) {
      var y = vh * 0.62;
      passos.forEach(function (li, i) {
        var topo = li.querySelector(".tl-badge").getBoundingClientRect().top;
        var proximo = passos[i + 1] ? passos[i + 1].querySelector(".tl-badge").getBoundingClientRect().top : topo + 1;
        var seg = Math.max(0, Math.min((y - topo) / (proximo - topo), 1));
        li.style.setProperty("--seg", seg);
        li.classList.toggle("on", topo < y);
      });
    } else {
      passos.forEach(function (li) { li.classList.add("on"); li.style.setProperty("--seg", 1); });
    }

    if (sticky && hero) {
      var passouHero = hero.getBoundingClientRect().bottom < 0;
      var emCompra = (planos && visivel(planos, vh)) || (final && visivel(final, vh));
      sticky.classList.toggle("is-visible", passouHero && !emCompra);
    }
  }

  var esperando = false;
  function aoRolar() {
    if (esperando) return;
    esperando = true;
    requestAnimationFrame(function () { atualizar(); esperando = false; });
  }
  window.addEventListener("scroll", aoRolar, { passive: true });
  window.addEventListener("resize", aoRolar);
  atualizar();
})();
