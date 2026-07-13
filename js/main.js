document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  // Failsafe: never let content stay invisible if the observer doesn't fire
  setTimeout(() => {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }, 2500);

  const track = document.querySelector('.gallery-track');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  if (track && prevBtn && nextBtn) {
    const scrollByCard = (direction) => {
      const card = track.querySelector('.gallery-photo');
      const cardWidth = card.getBoundingClientRect().width + 20;
      track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
    };

    prevBtn.addEventListener('click', () => scrollByCard(-1));
    nextBtn.addEventListener('click', () => scrollByCard(1));
  }

  initDiagnostico();
});

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
    financeiro: {
      titulo: 'Você é a Noiva Estrategista',
      texto: 'Pra você, cada real importa. A Jornada do Sim te dá controle financeiro completo — você sabe exatamente quanto gastar em cada fornecedor, sem surpresas no orçamento.'
    },
    fornecedores: {
      titulo: 'Você é a Noiva Exigente',
      texto: 'Você quer fazer as escolhas certas. Com o guia de mais de 450 perguntas pra fornecedores, você negocia com segurança e evita ciladas.'
    },
    organizacao: {
      titulo: 'Você é a Noiva Organizada',
      texto: 'Você não quer esquecer nada. O cronograma e o planner da Jornada do Sim organizam cada etapa do seu casamento, do início à contagem regressiva.'
    },
    tempo: {
      titulo: 'Você é a Noiva Sem Tempo a Perder',
      texto: 'Sua rotina é corrida, e tudo bem. Os vídeos curtos e o método direto da Jornada do Sim cabem no seu ritmo, sem tomar seu tempo à toa.'
    }
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

  overlay.addEventListener('click', (event) => {
    const option = event.target.closest('.diagnostico-option');
    if (!option) return;

    const [category, value] = option.dataset.answer.split(':');
    answers[category] = value;

    if (currentIndex < steps.length - 2) {
      showStep(currentIndex + 1);
    } else {
      finish();
    }
  });

  const closeDiagnostico = () => {
    overlay.classList.add('is-closing');
    document.body.classList.remove('diagnostico-open');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 500);
  };

  skipBtn.addEventListener('click', closeDiagnostico);
  ctaBtn.addEventListener('click', (event) => {
    event.preventDefault();
    closeDiagnostico();
  });
}
