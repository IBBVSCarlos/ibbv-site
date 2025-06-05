// =====================================
// 🚀 PWA - Service Worker e Notificações
// =====================================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js")
    .then(() => console.log("✅ Service Worker registrado com sucesso!"))
    .catch(error => console.log("⚠️ Erro ao registrar Service Worker:", error));
}

function solicitarPermissaoNotificacao() {
  if ("Notification" in window && "serviceWorker" in navigator) {
    Notification.requestPermission().then(permission => {
      console.log(permission === "granted" ? "✅ Permissão concedida!" : "⚠️ Permissão negada pelo usuário.");
    });
  }
}
document.addEventListener("DOMContentLoaded", solicitarPermissaoNotificacao);

// =====================================
// 🎨 Header - Logo & Semana Referência
// =====================================

// Garantindo execução após o carregamento do DOM
document.addEventListener("DOMContentLoaded", () => {
  const semanaReferenciaElemento = document.getElementById("semana-referencia");

  if (semanaReferenciaElemento) {
    definirSemanaReferencia();
  } else {
    console.warn("⚠️ Elemento #semana-referencia não encontrado!");
  }
});

// Função para definir a Semana Referência
function definirSemanaReferencia() {
  const hoje = new Date();
  const diaSemana = hoje.getDay();

  // Definir início e fim da semana corretamente
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));

  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(inicioSemana.getDate() + 6);

  // Formatar a data para exibição
  const formatoData = data =>
    data.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });

  const semanaTexto = `Semana: ${formatoData(inicioSemana)} a ${formatoData(fimSemana)}`;

  // Atualizar conteúdo somente se o elemento existir
  const semanaReferenciaElemento = document.getElementById("semana-referencia");
  if (semanaReferenciaElemento) {
    semanaReferenciaElemento.textContent = semanaTexto;
    console.log("✅ Semana referência definida:", semanaTexto);
  } else {
    console.warn("⚠️ Elemento #semana-referencia não encontrado!");
  }
}

// =====================================
// 🔥 Efeito de luz no logo do header
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("logoEffectShown")) {
    const light = document.querySelector(".light-effect");

    if (light) {
      light.style.animation = "moveLight 2s linear forwards";
      light.addEventListener("animationend", () => setTimeout(() => light.remove(), 500));
      localStorage.setItem("logoEffectShown", "true");
    } else {
      console.warn("⚠️ Elemento .light-effect não encontrado!");
    }
  }
});

// =====================================
// 🔄 Scroll - Exibição dinâmica das seções
// =====================================
window.addEventListener("load", () => {
  const sections = document.querySelectorAll(".section-box");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle("show", entry.isIntersecting));
  }, { threshold: 0.05 });

  sections.forEach(section => observer.observe(section));
});

// =====================================
// 🎉 Aniversariantes da Semana
// =====================================
async function carregarAniversariantesSemana() {
  try {
    const res = await fetch('data/aniversariantes.json');
    const aniversariantes = await res.json();
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 7);
    const emojis = ["🎉", "🎂", "🥳", "🎊", "🍰", "🎈", "✨", "😃"];

    const aniversariantesSemana = aniversariantes.filter(({ data }) => {
      const [dia, mes] = data.split('/').map(Number);
      const dataAniv = new Date(hoje.getFullYear(), mes - 1, dia);
      return dataAniv >= inicioSemana && dataAniv <= fimSemana;
    });

    document.getElementById("lista-aniversariantes").innerHTML = aniversariantesSemana.length
      ? aniversariantesSemana.map(p => {
          const hojeTexto = new Date().toLocaleDateString("pt-BR") === p.data ? " <strong>(hoje!)</strong>" : "";
          return `<li>${emojis[Math.floor(Math.random() * emojis.length)]} ${p.nome}${hojeTexto}</li>`;
        }).join("")
      : '<li>Nenhum aniversariante nesta semana.</li>';
  } catch (error) {
    console.error("Erro ao carregar aniversariantes:", error);
  }
}
document.addEventListener("DOMContentLoaded", carregarAniversariantesSemana);

// =====================================
// 🛐 Escala de Ministérios
// =====================================
async function carregarEscalaMinisterios() {
  try {
    const res = await fetch('data/escalamin.json');
    const escala = await res.json();
    const listaEscala = document.getElementById("lista-escala");

    listaEscala.innerHTML = escala.map(({ ministerio, escalados }) => `
      <li><strong>${ministerio}</strong>
        <ul>${escalados.map(({ dia, nome }) => `<li>${dia}: ${nome}</li>`).join('')}</ul>
      </li>`).join('');
  } catch (error) {
    console.error("Erro ao carregar escala de ministérios:", error);
    document.getElementById("lista-escala").innerHTML = '<li>Erro ao carregar escala.</li>';
  }
}
document.addEventListener("DOMContentLoaded", carregarEscalaMinisterios);

// =====================================
// 📢 Avisos IBBV
// =====================================
function carregarAvisos() {
  fetch('data/avisosibbv.json')
    .then(res => res.json())
    .then(({ avisos }) => {
      const listaAvisos = document.getElementById('lista-avisos');
listaAvisos.innerHTML = avisos.length
  ? avisos.map(({ texto, imagem, linkAgenda }) => `
      <li class="aviso-item">
        <p class="aviso-texto">${texto}</p>
        <a href="${linkAgenda}" target="_blank">
          <img src="${imagem}" alt="${texto}" class="aviso-img">
        </a>
      </li>
    `).join("")
  : '<li>Nenhum aviso disponível.</li>';
    })
    .catch(err => console.error('Erro ao carregar avisos:', err));
}
document.addEventListener("DOMContentLoaded", carregarAvisos);

// =====================================
// ✨ Estatuto - Modal & Pesquisa
// =====================================

document.addEventListener("DOMContentLoaded", () => {
  const botaoAbrir = document.getElementById("abrir-estatuto");
  const modal = document.getElementById("modalEstatuto");
  const estatutoContainer = document.getElementById("conteudo-estatuto");

  if (!botaoAbrir) {
    console.error("❌ ERRO: O botão 'abrir-estatuto' não foi encontrado! Verifique o HTML.");
    return;
  }

  if (!modal) {
    console.error("❌ ERRO: O modal 'modalEstatuto' não foi encontrado!");
    return;
  }

  if (!estatutoContainer) {
    console.warn("⚠️ Aviso: O conteúdo do Estatuto pode não carregar corretamente.");
  }

  console.log("✅ Elementos do Estatuto encontrados! Adicionando eventos...");

  botaoAbrir.addEventListener("click", () => {
    modal.style.display = "block";

    if (estatutoContainer && !estatutoContainer.innerHTML.includes("<h2>")) {
      carregarEstatuto();
    }
  });

  // 🔹 Fechar Estatuto pelo botão de fechar
  document.querySelectorAll(".btn-fechar").forEach(botao => {
    botao.addEventListener("click", fecharEstatuto);
  });

  // 🔹 Fechar ao clicar fora da área do modal
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      fecharEstatuto();
    }
  });
});

// 🔹 Função para fechar o Estatuto
function fecharEstatuto() {
  const modal = document.getElementById("modalEstatuto");
  if (modal) {
    modal.style.display = "none";
    console.log("✅ Estatuto fechado com sucesso!");
  } else {
    console.warn("⚠️ Tentativa de fechar um modal inexistente.");
  }
}

// 🔹 Carregar Estatuto dinamicamente dentro do modal
async function carregarEstatuto() {
  try {
    const res = await fetch("assets/estatuto.html");
    if (!res.ok) throw new Error("Erro ao carregar o Estatuto");

    const html = await res.text();
    const estatutoContainer = document.getElementById("conteudo-estatuto");

    if (estatutoContainer) {
      estatutoContainer.innerHTML = html;
      console.log("✅ Estatuto carregado corretamente!");
    } else {
      console.warn("⚠️ Elemento 'conteudo-estatuto' não encontrado!");
    }
  } catch (error) {
    console.error("❌ Erro ao carregar o Estatuto:", error);
  }
}

// 🔹 Função de pesquisa no Estatuto
function buscarPalavra() {
  const pesquisaInput = document.getElementById("pesquisa");
  const estatutoContainer = document.getElementById("conteudo-estatuto");

  if (!pesquisaInput || !estatutoContainer) {
    console.warn("⚠️ Elementos de pesquisa não encontrados.");
    return;
  }

  const termo = pesquisaInput.value.toLowerCase();
  estatutoContainer.innerHTML = estatutoContainer.innerHTML.replace(
    new RegExp(`(${termo})`, "gi"), `<span class="highlight">$1</span>`
  );

  console.log(`✅ Pesquisa realizada: "${termo}"`);
}

// =====================================
// 💳 PIX - Copiar Chave & Alternar Visibilidade
// =====================================
function copiarTexto(texto, mensagem) {
  navigator.clipboard.writeText(texto).then(() => alert(mensagem));
}
function copiarPix() {
  copiarTexto(document.getElementById("pix").textContent.trim(), "Chave PIX copiada!");
}
document.getElementById("btn-pix").addEventListener("click", () => {
  document.getElementById("pix-box").style.display = "block";
});

