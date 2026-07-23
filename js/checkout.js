document.addEventListener('DOMContentLoaded', () => {
  initPlanSelector();
  initPaymentToggle();
});

/* ---------- Seleção de plano ---------- */
function initPlanSelector() {
  const tabs = document.querySelectorAll('.plan-tab');
  const summaryName = document.getElementById('summary-plan-name');
  const summaryPrice = document.getElementById('summary-plan-price');
  const summaryTotal = document.getElementById('summary-total');
  const submitPrice = document.getElementById('submit-price');

  function selectPlan(tab) {
    tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
    const price = 'R$' + tab.dataset.price;
    if (summaryName) summaryName.textContent = 'Jornada do Sim — ' + tab.dataset.name;
    if (summaryPrice) summaryPrice.textContent = price + ' à vista';
    if (summaryTotal) summaryTotal.textContent = price;
    if (submitPrice) submitPrice.textContent = price;
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => selectPlan(tab));
  });

  const requested = new URLSearchParams(window.location.search).get('plano');
  const initial = [...tabs].find((t) => t.dataset.plan === requested) || tabs[1] || tabs[0];
  if (initial) selectPlan(initial);
}

/* ---------- Forma de pagamento (cartão / Pix) ---------- */
function initPaymentToggle() {
  const options = document.querySelectorAll('.payment-option');
  const cartaoFields = document.getElementById('payment-cartao');
  const pixFields = document.getElementById('payment-pix');

  options.forEach((option) => {
    option.addEventListener('click', () => {
      options.forEach((o) => o.classList.toggle('is-active', o === option));
      const isCartao = option.dataset.method === 'cartao';
      cartaoFields.hidden = !isCartao;
      pixFields.hidden = isCartao;
    });
  });
}
