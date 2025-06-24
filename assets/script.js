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

  // Obter os nomes dos meses
  const opcoesDiaMes = { day: "2-digit", month: "long" };
  const inicioFormatado = inicioSemana.toLocaleDateString("pt-BR", opcoesDiaMes);
  const fimFormatado = fimSemana.toLocaleDateString("pt-BR", opcoesDiaMes);
  const mesInicio = inicioSemana.toLocaleDateString("pt-BR", { month: "long" });
  const mesFim = fimSemana.toLocaleDateString("pt-BR", { month: "long" });

  // Ajuste na exibição do nome do mês
  const semanaTexto = mesInicio === mesFim
    ? `${inicioSemana.getDate()} a ${fimSemana.getDate()} de ${mesInicio}`
    : `${inicioFormatado} a ${fimFormatado}`;

  // Atualizar conteúdo no elemento
  const semanaReferenciaElemento = document.getElementById("semana-referencia");
  if (semanaReferenciaElemento) {
    semanaReferenciaElemento.textContent = semanaTexto;
    console.log("✅ Semana referência ajustada:", semanaTexto);
  } else {
    console.warn("⚠️ Elemento #semana-referencia não encontrado!");
  }
}


// =====================================
// 🔥 Efeito de luz no logo do header
// =====================================
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
// 📢 Avisos IBBV (com expiração automática)
// =====================================
function carregarAvisos() {
  fetch('data/avisosibbv.json')
    .then(res => res.json())
    .then(({ avisos }) => {
      const hoje = new Date();
      const listaAvisos = document.getElementById('lista-avisos');

      const avisosValidos = avisos.filter(aviso => {
        const expiracao = new Date(aviso.expiraEm);
        return hoje <= expiracao;
      });

      listaAvisos.innerHTML = avisosValidos.length
        ? avisosValidos.map(({ texto, imagem, linkAgenda }) => `
          <li class="aviso-item">
            <p class="aviso-texto">${texto}</p>
            ${imagem ? `<img src="${imagem}" alt="${texto}" class="aviso-img" onclick="ampliarImagem('${imagem}')">` : ''}
            <div class="aviso-botoes">
              ${imagem ? `
              <a href="${imagem}" download class="btn-aviso" title="Baixar imagem">
                📥 Baixar
              </a>` : ''}
              ${linkAgenda ? `
              <a href="${linkAgenda}" target="_blank" class="btn-aviso" title="Abrir agenda">
                📅 Colocar na Agenda
              </a>` : ''}
            </div>
          </li>
        `).join("")
        : '<li>Nenhum aviso disponível.</li>';
    })
    .catch(err => console.error('Erro ao carregar avisos:', err));
}

document.addEventListener("DOMContentLoaded", carregarAvisos);

// =====================================
// 🔍 Ampliar imagem
// =====================================
function ampliarImagem(src) {
  const modal = document.createElement('div');
  modal.className = 'imagem-modal';
  modal.innerHTML = `
    <div class="imagem-modal-conteudo">
      <span class="imagem-modal-fechar" onclick="this.parentElement.parentElement.remove()">✖</span>
      <img src="${src}" alt="Aviso ampliado">
    </div>
  `;
  document.body.appendChild(modal);
}

