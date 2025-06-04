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
function definirSemanaReferencia() {
  const hoje = new Date();
  const diaSemana = hoje.getDay();
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(inicioSemana.getDate() + 6);
  const formatoData = data => data.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });

  document.getElementById("semana-referencia").textContent =
    `Semana referência: ${formatoData(inicioSemana)} a ${formatoData(fimSemana)}`;
}
document.addEventListener("DOMContentLoaded", definirSemanaReferencia);

// Efeito de luz no logo do header
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("logoEffectShown")) {
    const light = document.querySelector(".light-effect");
    light.style.animation = "moveLight 2s linear forwards";
    light.addEventListener("animationend", () => setTimeout(() => light.remove(), 500));
    localStorage.setItem("logoEffectShown", "true");
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
        ? avisos.map(({ texto, imagem }) => `<li class="aviso-item"><p class="aviso-texto">${texto}</p><img src="${imagem}" alt="${texto}" class="aviso-img"></li>`).join("")
        : '<li>Nenhum aviso disponível.</li>';
    })
    .catch(err => console.error('Erro ao carregar avisos:', err));
}
document.addEventListener("DOMContentLoaded", carregarAvisos);

// =====================================
// ✨ Estatuto - Modal & Pesquisa
// =====================================
document.getElementById("abrir-estatuto").addEventListener("click", () => {
  document.getElementById("modalEstatuto").style.display = "block";
  if (!document.getElementById("conteudo-estatuto").innerHTML.includes("<h2>")) carregarEstatuto();
});
function fecharEstatuto() {
  document.getElementById("modalEstatuto").style.display = "none";
}
async function carregarEstatuto() {
  try {
    const res = await fetch("assets/estatuto.html");
    document.getElementById("conteudo-estatuto").innerHTML = await res.text();
  } catch (error) {
    console.error("Erro ao carregar o Estatuto:", error);
  }
}
function buscarPalavra() {
  let termo = document.getElementById("pesquisa").value.toLowerCase();
  document.getElementById("conteudo-estatuto").innerHTML =
    document.getElementById("conteudo-estatuto").innerHTML.replace(new RegExp(`(${termo})`, "gi"), `<span class="highlight">$1</span>`);
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
