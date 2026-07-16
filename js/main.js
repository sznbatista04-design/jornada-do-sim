document.addEventListener('DOMContentLoaded', () => {
  initFaq();
  initReveal();
  initDiagnostico();
  initChat();
});

/* ---------- FAQ (accordion) ---------- */
function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => { if (other !== item) other.open = false; });
      }
    });
  });
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }
  // Failsafe: never let content stay invisible
  setTimeout(() => revealEls.forEach((el) => el.classList.add('in-view')), 2500);
}

/* ---------- Mini-diagnóstico ---------- */
function initDiagnostico() {
  const overlay = document.getElementById('diagnostico');
  if (!overlay) return;

  const steps = [...overlay.querySelectorAll('.diagnostico-step')];
  const dots = [...overlay.querySelectorAll('.dot')];
  const skipBtn = document.getElementById('diagnostico-skip');
  const ctaBtn = document.getElementById('diagnostico-cta');
  const resultTitle = document.getElementById('diagnostico-titulo');
  const resultText = document.getElementById('diagnostico-texto');

  const resultados = {
    financeiro: { titulo: 'Você é a Noiva Estrategista', texto: 'Pra você, cada real importa. Na Jornada do Sim você vê seu orçamento por categoria, acompanha gastos e parcelas em tempo real e decide sem susto.' },
    fornecedores: { titulo: 'Você é a Noiva Exigente', texto: 'Você quer fazer as escolhas certas. A Jornada do Sim te mostra o que perguntar em cada reunião e a Gab.IA analisa seus contratos antes de assinar.' },
    organizacao: { titulo: 'Você é a Noiva Organizada', texto: 'Você não quer esquecer nada. O checklist e a agenda inteligente organizam cada etapa do seu casamento, com lembretes pra você nunca perder um prazo.' },
    tempo: { titulo: 'Você é a Noiva Sem Tempo a Perder', texto: 'Sua rotina é corrida. A Jornada do Sim te mostra sempre o próximo passo e a Gab.IA responde suas dúvidas 24h, no seu ritmo.' }
  };

  document.body.classList.add('diagnostico-open');
  let currentIndex = 0;
  const answers = {};

  const showStep = (index) => {
    steps.forEach((step, i) => step.classList.toggle('active', i === index));
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.classList.toggle('done', i < index);
    });
    currentIndex = index;
  };

  const finish = () => {
    const perfilKey = answers.perfil || 'organizacao';
    const resultado = resultados[perfilKey] || resultados.organizacao;
    resultTitle.textContent = resultado.titulo;
    resultText.textContent = resultado.texto;
    showStep(steps.length - 1);
    if (dots[3]) dots[3].classList.add('done');
  };

  const closeDiagnostico = () => {
    overlay.classList.add('is-closing');
    document.body.classList.remove('diagnostico-open');
    setTimeout(() => { overlay.style.display = 'none'; }, 500);
  };

  overlay.addEventListener('click', (event) => {
    const option = event.target.closest('.diagnostico-option');
    if (!option) return;
    const [category, value] = option.dataset.answer.split(':');
    answers[category] = value;
    if (currentIndex < steps.length - 2) showStep(currentIndex + 1);
    else finish();
  });

  skipBtn.addEventListener('click', closeDiagnostico);
  ctaBtn.addEventListener('click', closeDiagnostico);
}

/* ---------- Chat widget (Gab.IA — FAQ da oferta) ---------- */
function initChat() {
  const widget = document.getElementById('chat-widget');
  const planos = document.getElementById('planos');
  if (!widget || !planos) return;

  const toggle = document.getElementById('chat-toggle');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const messages = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const suggestions = document.getElementById('chat-suggestions');

  // Base de respostas (exclusivamente sobre a oferta)
  const knowledge = [
    { keys: ['garantia', 'reembolso', 'devolve', 'arrepend', 'cancelar', 'devolução'], answer: 'Você tem 7 dias de garantia: se não for pra você, é só pedir e devolvemos o seu dinheiro, sem burocracia.' },
    { keys: ['pagar', 'pagamento', 'parcel', 'cartão', 'cartao', 'pix', 'boleto', 'preço', 'preco', 'valor', 'quanto custa', 'custa'], answer: 'Os planos são pagamento único (sem mensalidade): 6 meses por R$257, 12 meses por R$397 (o mais popular) e 24 meses por R$697. Você pode pagar à vista ou parcelar no cartão em até 12x, além de Pix e boleto.' },
    { keys: ['acesso', 'acessar', 'liberado', 'imediato', 'como recebo', 'login', 'entrar', 'baixar', 'aplicativo', 'app', 'play store', 'celular', 'tablet', 'computador'], answer: 'O acesso é liberado imediatamente após a confirmação do pagamento. Você acessa pelo navegador no celular, tablet ou computador com e-mail e senha — ou baixa o app Jornada do Sim, disponível para Android na Play Store.' },
    { keys: ['renovar', 'upgrade', 'renova', 'vencimento', 'expira'], answer: 'Os planos têm período fechado e não renovam automaticamente. Sempre que quiser, você pode fazer upgrade ou renovar pela sua conta. Enviamos um e-mail de lembrete antes do vencimento pra você não ser pega de surpresa.' },
    { keys: ['assessora', 'substitui', 'cerimonial', 'presencial'], answer: 'A Jornada do Sim te acompanha em tudo que vem antes do grande dia. Ela não substitui uma assessora presencial no dia do casamento, mas com ou sem assessoria você consegue planejar todo o seu casamento com ela.' },
    { keys: ['difícil', 'dificil', 'fácil', 'facil', 'usar', 'intuitivo', 'tecnologia', 'complicado'], answer: 'O aplicativo é intuitivo e foi pensado exatamente para noivas que não têm experiência com casamentos ou com tecnologia.' },
    { keys: ['tipo', 'religioso', 'civil', 'praia', 'campo', 'íntimo', 'intimo', 'prazo', 'qualquer casamento', 'mini'], answer: 'Sim! Civil, religioso, na praia, no campo ou no salão, grande ou íntimo. O aplicativo se adapta ao perfil e à data do seu casamento, independente do prazo que você tenha.' },
    { keys: ['gabia', 'gab.ia', 'ia', 'inteligência', 'inteligencia', '24h', 'dúvida', 'duvida'], answer: 'A Gab.IA é a sua assessora por inteligência artificial, disponível 24h dentro da plataforma. Ela tira dúvidas, orienta cada decisão, ajuda a analisar contratos e te acompanha em cada etapa do planejamento.' }
  ];

  const suggestionList = ['Quais são os planos?', 'Tenho garantia?', 'Como acesso o app?', 'Formas de pagamento'];

  const scrollDown = () => { messages.scrollTop = messages.scrollHeight; };

  const addMessage = (text, who) => {
    const el = document.createElement('div');
    el.className = 'chat-msg ' + who;
    el.textContent = text;
    messages.appendChild(el);
    scrollDown();
  };

  const answerFor = (text) => {
    const q = text.toLowerCase();
    for (const item of knowledge) {
      if (item.keys.some((k) => q.includes(k))) return item.answer;
    }
    return 'Posso te ajudar com dúvidas sobre acesso, formas de pagamento, garantia e como funciona a Jornada do Sim. Sobre isso, o que você gostaria de saber? Para outras perguntas, toque em "Ver planos" e fale com a nossa equipe.';
  };

  const respond = (text) => {
    addMessage(text, 'user');
    setTimeout(() => addMessage(answerFor(text), 'bot'), 400);
  };

  suggestionList.forEach((s) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chat-suggestion';
    chip.textContent = s;
    chip.addEventListener('click', () => respond(s));
    suggestions.appendChild(chip);
  });

  let greeted = false;
  const openPanel = () => {
    panel.hidden = false;
    if (!greeted) {
      addMessage('Oi! Eu sou a Gab.IA 💜 Posso tirar suas dúvidas sobre a Jornada do Sim — acesso, pagamento, garantia e como funciona. Como posso ajudar?', 'bot');
      greeted = true;
    }
    input.focus();
  };

  toggle.addEventListener('click', () => { panel.hidden ? openPanel() : (panel.hidden = true); });
  closeBtn.addEventListener('click', () => { panel.hidden = true; });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    respond(text);
    input.value = '';
  });

  // Mostrar o botão só após passar da seção de planos
  const reveal = () => {
    const planosBottom = planos.getBoundingClientRect().bottom;
    if (planosBottom < window.innerHeight * 0.6) widget.hidden = false;
    else if (panel.hidden) widget.hidden = true;
  };
  window.addEventListener('scroll', reveal, { passive: true });
  reveal();
}
