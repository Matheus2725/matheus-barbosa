document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector(".theme-icon");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  const allNavLinks = document.querySelectorAll(".nav-link");
  const formContato = document.getElementById("form-contato");
  const modalSucesso = document.getElementById("modal-sucesso");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalFechar = document.getElementById("modal-fechar");

  /* ====================================================
     FUNCIONALIDADE 1: ALTERNÂNCIA DE TEMA CLARO / ESCURO
     ====================================================*/

  /**
   * Aplica o tema passado como argumento e atualiza o ícone do botão.
   * @param {string} tema - 'dark-theme' ou 'light-theme'
   */
  function aplicarTema(tema) {
    // Remove as duas classes e adiciona apenas a correta
    body.classList.remove("dark-theme", "light-theme");
    body.classList.add(tema);

    // Atualiza o ícone do botão conforme o tema atual
    themeIcon.textContent = tema === "dark-theme" ? "🌙" : "☀️";
  }

  // Ao carregar a página, verifica se há um tema salvo
  const temaSalvo = localStorage.getItem("tema") || "dark-theme";
  aplicarTema(temaSalvo);

  // Ao clicar no botão, alterna entre os dois temas
  themeToggle.addEventListener("click", function () {
    // Se o tema atual é dark, muda para light e vice-versa
    const novoTema = body.classList.contains("dark-theme")
      ? "light-theme"
      : "dark-theme";
    aplicarTema(novoTema);
    // Salva a escolha do usuário
    localStorage.setItem("tema", novoTema);
  });

  /* ====================================================
     FUNCIONALIDADE 2: MENU HAMBURGUER (MOBILE)
     ====================================================*/

  hamburger.addEventListener("click", function () {
    // .toggle() adiciona a classe se não existe, remove se existe
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("aberto");

    // Acessibilidade: informa ao leitor de tela se o menu está aberto
    const estaAberto = navLinks.classList.contains("aberto");
    hamburger.setAttribute("aria-expanded", estaAberto);
  });

  /* ====================================================
     FUNCIONALIDADE 3: FECHAR MENU AO CLICAR EM LINK
     ====================================================*/

  allNavLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      // Só fecha se o menu hamburguer estiver visível (mobile)
      if (navLinks.classList.contains("aberto")) {
        hamburger.classList.remove("open");
        navLinks.classList.remove("aberto");
        hamburger.setAttribute("aria-expanded", false);
      }
    });
  });

  /* ====================================================
     FUNCIONALIDADE 4: LINK ATIVO NA NAVBAR
     ====================================================*/

  // Seleciona todas as seções que têm um ID
  const secoes = document.querySelectorAll("section[id]");

  const observerConfig = {
    rootMargin: "-40% 0px -55% 0px", // Considera ativa a seção no centro da tela
    threshold: 0, // Aciona assim que qualquer parte aparecer
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Remove o destaque de todos os links
        allNavLinks.forEach(function (link) {
          link.classList.remove("ativo");
        });

        // Adiciona o destaque ao link correspondente à seção visível
        const idDaSecao = entry.target.getAttribute("id");
        const linkAtivo = document.querySelector(
          '.nav-link[href="#' + idDaSecao + '"]',
        );
        if (linkAtivo) {
          linkAtivo.classList.add("ativo");
        }
      }
    });
  }, observerConfig);

  // Observa cada seção
  secoes.forEach(function (secao) {
    observer.observe(secao);
  });

  const estiloAtivo = document.createElement("style");
  estiloAtivo.textContent = ".nav-link.ativo { color: var(--accent); }";
  document.head.appendChild(estiloAtivo);

  /* ====================================================
     FUNCIONALIDADE 5: VALIDAÇÃO DO FORMULÁRIO DE CONTATO
     ====================================================*/

  const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Exibe uma mensagem de erro num campo específico.
   * @param {string} idCampo  - ID do input/textarea (ex: 'nome')
   * @param {string} mensagem - Texto do erro a exibir
   */
  function mostrarErro(idCampo, mensagem) {
    const campo = document.getElementById(idCampo);
    const erroSpan = document.getElementById("erro-" + idCampo);

    campo.classList.add("campo-erro"); // Deixa a borda vermelha
    erroSpan.textContent = mensagem; // Escreve a mensagem de erro
  }

  /**
   * Remove a mensagem de erro de um campo.
   * @param {string} idCampo - ID do input/textarea
   */
  function limparErro(idCampo) {
    const campo = document.getElementById(idCampo);
    const erroSpan = document.getElementById("erro-" + idCampo);

    campo.classList.remove("campo-erro"); // Remove borda vermelha
    erroSpan.textContent = ""; // Limpa a mensagem
  }

  /**
   * Valida todos os campos do formulário.
   * @returns {boolean} true se tudo válido, false se houver erros
   */
  function validarFormulario() {
    // Pega os valores dos campos, removendo espaços nas pontas
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    let formularioValido = true; // Assume válido até encontrar erro

    /* --- Validação do Nome --- */
    limparErro("nome"); // Limpa erro anterior antes de validar
    if (nome === "") {
      mostrarErro("nome", "Por favor, informe seu nome.");
      formularioValido = false;
    } else if (nome.length < 3) {
      mostrarErro("nome", "O nome deve ter pelo menos 3 caracteres.");
      formularioValido = false;
    }

    /* --- Validação do E-mail --- */
    limparErro("email");
    if (email === "") {
      mostrarErro("email", "Por favor, informe seu e-mail.");
      formularioValido = false;
    } else if (!REGEX_EMAIL.test(email)) {
      // O método .test() verifica se o e-mail corresponde à expressão regular
      mostrarErro("email", "Informe um e-mail válido (ex: voce@email.com).");
      formularioValido = false;
    }

    /* --- Validação da Mensagem --- */
    limparErro("mensagem");
    if (mensagem === "") {
      mostrarErro("mensagem", "Por favor, escreva sua mensagem.");
      formularioValido = false;
    } else if (mensagem.length < 10) {
      mostrarErro("mensagem", "A mensagem deve ter pelo menos 10 caracteres.");
      formularioValido = false;
    }

    return formularioValido;
  }

  formContato.addEventListener("submit", function (evento) {
    evento.preventDefault();

    // Só prossegue se a validação passar
    if (validarFormulario()) {
      // Simulação de envio: limpa os campos
      formContato.reset();

      // Limpa também as mensagens de erro visuais
      ["nome", "email", "mensagem"].forEach(limparErro);

      // Exibe o modal de sucesso
      abrirModal();
    }
  });

  /* Remove o erro em tempo real conforme o usuário digita */
  ["nome", "email", "mensagem"].forEach(function (idCampo) {
    const campo = document.getElementById(idCampo);
    campo.addEventListener("input", function () {
      limparErro(idCampo);
    });
  });

  /* ====================================================
     FUNCIONALIDADE 6: MODAL DE CONFIRMAÇÃO
     ====================================================*/

  /** Abre o modal de sucesso */
  function abrirModal() {
    modalSucesso.classList.add("ativo");
    modalOverlay.classList.add("ativo");
    // Foca no botão de fechar para acessibilidade
    modalFechar.focus();
  }

  /** Fecha o modal de sucesso */
  function fecharModal() {
    modalSucesso.classList.remove("ativo");
    modalOverlay.classList.remove("ativo");
  }

  // Fecha ao clicar no botão "Fechar"
  modalFechar.addEventListener("click", fecharModal);

  // Fecha ao clicar fora do modal (na sobreposição escura)
  modalOverlay.addEventListener("click", fecharModal);

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && modalSucesso.classList.contains("ativo")) {
      fecharModal();
    }
  });
});
