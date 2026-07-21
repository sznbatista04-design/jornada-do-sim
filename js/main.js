document.addEventListener('DOMContentLoaded', () => {
  initFaq();
  initReveal();
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

/* ---------- Chat widget (Gab.IA — FAQ da oferta) ---------- */
function initChat() {
  const widget = document.getElementById('chat-widget');
  const planos = document.getElementById('planos');
  if (!widget || !planos) return;

  const toggle = document.getElementById('chat-toggle');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const messages = document.getElementById('chat-messages');
  const suggestions = document.getElementById('chat-suggestions');

  // Perguntas fixas e respostas (exclusivamente sobre a oferta) — sem campo de texto livre
  const qna = [
    { question: 'Quais são os planos?', answer: 'Temos 3 opções de acesso, todas com os mesmos recursos — você escolhe só o período: 6 meses (até 12x de R$22,11), 12 meses, o mais popular (até 12x de R$34,14), e 24 meses (até 12x de R$59,91). Pagamento único, sem mensalidade recorrente.' },
    { question: 'Tenho garantia?', answer: 'Você tem 7 dias de garantia: se não for pra você, é só pedir e devolvemos o seu dinheiro, sem burocracia.' },
    { question: 'Como acesso o app?', answer: 'O acesso é liberado imediatamente após a confirmação do pagamento. Você acessa pelo navegador no celular, tablet ou computador com e-mail e senha — ou baixa o app Jornada do Sim, disponível para Android na Play Store.' },
    { question: 'Formas de pagamento', answer: 'Você pode pagar à vista ou parcelar no cartão de crédito em até 12x, ou via Pix.' }
  ];

  const scrollDown = () => { messages.scrollTop = messages.scrollHeight; };

  const addMessage = (text, who) => {
    const el = document.createElement('div');
    el.className = 'chat-msg ' + who;
    el.textContent = text;
    messages.appendChild(el);
    scrollDown();
  };

  const respond = (item) => {
    addMessage(item.question, 'user');
    setTimeout(() => addMessage(item.answer, 'bot'), 400);
  };

  qna.forEach((item) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chat-suggestion';
    chip.textContent = item.question;
    chip.addEventListener('click', () => respond(item));
    suggestions.appendChild(chip);
  });

  let greeted = false;
  const openPanel = () => {
    panel.hidden = false;
    if (!greeted) {
      addMessage('Oi! Eu sou a Gab.IA 💜 Toque numa das perguntas abaixo pra eu te ajudar.', 'bot');
      greeted = true;
    }
  };

  toggle.addEventListener('click', () => { panel.hidden ? openPanel() : (panel.hidden = true); });
  closeBtn.addEventListener('click', () => { panel.hidden = true; });

  // Mostrar o botão só após passar da seção de planos
  const reveal = () => {
    const planosBottom = planos.getBoundingClientRect().bottom;
    if (planosBottom < window.innerHeight * 0.6) widget.hidden = false;
    else if (panel.hidden) widget.hidden = true;
  };
  window.addEventListener('scroll', reveal, { passive: true });
  reveal();
}
