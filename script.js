/* ============================================================
   PORTFÓLIO — SCRIPT PRINCIPAL (script.js)
   ------------------------------------------------------------
   Organização do ficheiro:
   1. Navbar (fundo ao rolar + menu hambúrguer + scroll suave)
   2. Efeito de digitação no Hero
   3. Scroll Reveal (Intersection Observer)
   4. Barras de progresso das Competências
   5. Contadores animados das Estatísticas
   6. Filtro de Projetos
   7. Botão Voltar ao Topo
   8. Ano automático no rodapé
   ============================================================ */

/* Espera que todo o HTML esteja carregado antes de correr o script,
   garantindo que todos os elementos já existem no DOM. */
document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. NAVBAR
     ============================================================ */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  // Adiciona fundo mais sólido à navbar quando o utilizador desce a página
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Abre/fecha o menu hambúrguer no telemóvel
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Fecha o menu mobile automaticamente ao clicar num link
  // e faz o scroll suave até à secção correspondente.
  navLinkItems.forEach((link) => {
    link.addEventListener('click', (event) => {
      // Fecha o menu (caso esteja aberto em ecrã pequeno)
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');

      // Marca visualmente o link clicado como "ativo"
      navLinkItems.forEach((item) => item.classList.remove('active-link'));
      link.classList.add('active-link');

      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        event.preventDefault();
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Atualiza o link ativo da navbar automaticamente conforme o scroll
  const sectionsWithId = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let currentSectionId = '';

    sectionsWithId.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinkItems.forEach((link) => {
      link.classList.remove('active-link');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active-link');
      }
    });
  });


  /* ============================================================
     2. EFEITO DE DIGITAÇÃO (Hero — profissão)
     ------------------------------------------------------------
     PARA EDITAR AS PALAVRAS QUE APARECEM, muda o array abaixo.
     Cada string do array vai ser escrita e apagada, uma após a outra.
     ============================================================ */
  const typingWords = [
    'Programador Front-End',
    'Criador de Interfaces',
    'Apaixonado por desenvolvimento WEB',
    'Criativo e Eficiente'
  ];

  const typingTextEl = document.getElementById('typingText');
  let wordIndex = 0;      // qual palavra do array está a ser exibida
  let charIndex = 0;      // qual letra da palavra atual já foi escrita
  let isDeleting = false; // se está a apagar (true) ou a escrever (false)

  function typeEffect() {
    const currentWord = typingWords[wordIndex];

    if (isDeleting) {
      // Remove uma letra por vez
      charIndex--;
      typingTextEl.textContent = currentWord.substring(0, charIndex);
    } else {
      // Adiciona uma letra por vez
      charIndex++;
      typingTextEl.textContent = currentWord.substring(0, charIndex);
    }

    // Velocidade: mais rápida a apagar, mais lenta a escrever
    let typingSpeed = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === currentWord.length) {
      // Terminou de escrever a palavra: espera antes de começar a apagar
      typingSpeed = 1600;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Terminou de apagar: avança para a próxima palavra do array
      isDeleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;
      typingSpeed = 400;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Inicia o efeito de digitação (só se o elemento existir na página)
  if (typingTextEl) {
    typeEffect();
  }


  /* ============================================================
     3. SCROLL REVEAL
     ------------------------------------------------------------
     Observa todos os elementos com a classe .reveal e adiciona
     a classe .is-visible assim que entram na área visível do ecrã.
     Isto ativa a transição de fade-in + slide-up definida no CSS.
     ============================================================ */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // anima apenas uma vez
      }
    });
  }, {
    threshold: 0.15, // ativa quando 15% do elemento está visível
  });

  revealElements.forEach((el) => revealObserver.observe(el));


  /* ============================================================
     4. BARRAS DE PROGRESSO DAS COMPETÊNCIAS
     ------------------------------------------------------------
     Cada barra (.skill-bar-fill) tem um atributo data-percent no
     HTML. Quando o cartão entra no ecrã, a barra anima de 0% até
     esse valor (a transição suave é feita via CSS, no width).
     ============================================================ */
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetPercent = bar.getAttribute('data-percent');
        // Pequeno atraso para a animação começar depois do reveal do cartão
        setTimeout(() => {
          bar.style.width = `${targetPercent}%`;
        }, 150);
        observer.unobserve(bar);
      }
    });
  }, {
    threshold: 0.4,
  });

  skillBars.forEach((bar) => skillsObserver.observe(bar));


  /* ============================================================
     5. CONTADORES ANIMADOS DAS ESTATÍSTICAS
     ------------------------------------------------------------
     Cada número (.stat-number) tem um atributo data-target no HTML
     com o valor final. A função abaixo conta de 0 até esse valor
     de forma animada, usando requestAnimationFrame.
     ============================================================ */
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800; // duração total da animação, em milissegundos
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing suave (ease-out) para a contagem desacelerar no final
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(eased * target);

      el.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = target; // garante que termina exatamente no valor certo
      }
    }

    requestAnimationFrame(updateCount);
  }

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5,
  });

  statNumbers.forEach((num) => statsObserver.observe(num));


  /* ============================================================
     6. FILTRO DE PROJETOS
     ------------------------------------------------------------
     Cada botão de filtro tem um atributo data-filter (ex: "html").
     Cada cartão de projeto tem um atributo data-category com uma
     lista de tecnologias separadas por espaço (ex: "html css js").
     Ao clicar num filtro, mostramos apenas os cartões cuja
     data-category contenha o filtro selecionado.
     ============================================================ */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const noResultsMsg = document.getElementById('noResults');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Atualiza qual botão está marcado como ativo
      filterButtons.forEach((btn) => btn.classList.remove('active-filter'));
      button.classList.add('active-filter');

      const selectedFilter = button.getAttribute('data-filter');
      let visibleCount = 0;

      projectCards.forEach((card) => {
        const cardCategories = card.getAttribute('data-category').split(' ');

        const shouldShow = selectedFilter === 'todos' || cardCategories.includes(selectedFilter);

        if (shouldShow) {
          card.classList.remove('hidden-card');
          visibleCount++;
        } else {
          card.classList.add('hidden-card');
        }
      });

      // Mostra a mensagem "nenhum projeto encontrado" se necessário
      noResultsMsg.classList.toggle('show', visibleCount === 0);
    });
  });


  /* ============================================================
     7. BOTÃO VOLTAR AO TOPO
     ============================================================ */
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ============================================================
     8. ANO AUTOMÁTICO NO RODAPÉ
     ------------------------------------------------------------
     Atualiza automaticamente o ano exibido no "© ano Nome",
     para nunca precisares de o alterar manualmente.
     ============================================================ */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
