/* ========================================
   PoupaLuz - JavaScript
   Interações e funcionalidades
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ----- Menu mobile -----
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('open');
    });

    // Fecha menu ao clicar em um link
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('open');
      });
    });
  }

  // ----- Header com sombra ao rolar -----
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ----- Rolagem suave (já nativa via CSS, reforço para links) -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ----- Animações de entrada (Intersection Observer) -----
  const revealElements = document.querySelectorAll(
    '.card, .solucao-item, .fluxo-item, .dash-card, .impacto-item, .calc-box, .consciencia-box, .cta-box'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => observer.observe(el));

  // ----- Contadores animados (Dashboard + Impacto) -----
  function animateCounter(element, target, duration = 1800) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(start + (target - start) * ease);
      element.textContent = value.toLocaleString('pt-BR');
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString('pt-BR');
      }
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          if (!isNaN(target) && !el.classList.contains('counted')) {
            el.classList.add('counted');
            animateCounter(el, target);
          }
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.dash-value[data-target], .impacto-num[data-target]').forEach(el => {
    counterObserver.observe(el);
  });

  // ----- Calculadora de desperdício -----
  const calcForm = document.getElementById('calc-form');
  const calcResult = document.getElementById('calc-result');
  const calcMessage = document.getElementById('calc-message');
  const calcHighlight = document.getElementById('calc-highlight');

  if (calcForm) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const consumo = parseFloat(document.getElementById('consumo').value);
      const tarifa = parseFloat(document.getElementById('tarifa').value);
      const desperdicioPct = parseFloat(document.getElementById('desperdicio').value);

      if (isNaN(consumo) || isNaN(tarifa) || isNaN(desperdicioPct)) {
        alert('Preencha todos os campos corretamente.');
        return;
      }

      // Estimativa: a PoupaLuz pode reduzir cerca de 60-70% do desperdício atual
      const reducaoDesperdicio = desperdicioPct * 0.65;
      const kwhEconomizados = consumo * (reducaoDesperdicio / 100);
      const economiaReais = kwhEconomizados * tarifa;
      const economiaAnual = economiaReais * 12;

      calcMessage.textContent =
        `Com base nos dados informados, a PoupaLuz pode ajudar a reduzir aproximadamente ${reducaoDesperdicio.toFixed(1)}% do desperdício atual.`;

      calcHighlight.innerHTML =
        `Economia estimada: <strong>R$ ${economiaReais.toFixed(2)}</strong>/mês<br>
         <span style="font-size:0.95rem;font-weight:600">≈ R$ ${economiaAnual.toFixed(0)} por ano</span>`;

      calcResult.hidden = false;
      calcResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // ----- Formulário de contato -----
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = document.getElementById('nome').value.trim();
      const email = document.getElementById('email').value.trim();
      const mensagem = document.getElementById('mensagem').value.trim();

      if (!nome || !email || !mensagem) {
        alert('Por favor, preencha todos os campos.');
        return;
      }

      // Validação simples de e-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Digite um e-mail válido.');
        return;
      }

      // Simula envio (sem backend)
      contactForm.reset();
      formSuccess.hidden = false;

      setTimeout(() => {
        formSuccess.hidden = true;
      }, 5000);
    });
  }

  // ----- Feedback visual nos botões -----
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'scale(0.97)';
    });
    btn.addEventListener('mouseup', () => {
      btn.style.transform = '';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
});
