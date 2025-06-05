// =====================================
// ✨ Estatuto - Modal & Pesquisa
// =====================================

document.addEventListener("DOMContentLoaded", () => {
  const botaoAbrir = document.getElementById("abrir-estatuto");
  const modal = document.getElementById("modalEstatuto");
  const estatutoContainer = document.getElementById("conteudo-estatuto");

  // 🔹 Verificando se todos os elementos existem antes de executar o código
  if (!botaoAbrir || !modal || !estatutoContainer) {
    console.warn("⚠️ Elementos necessários para o Estatuto não encontrados! Verifique o HTML.");
    return;
  }

  botaoAbrir.addEventListener("click", () => {
    modal.style.display = "block";

    if (!estatutoContainer.innerHTML.includes("<h2>")) {
      carregarEstatuto();
    }
  });

  // 🔹 Fechar Estatuto pelo botão ou ao clicar fora do modal
  document.querySelectorAll(".btn-fechar").forEach(botao => {
    botao.addEventListener("click", fecharEstatuto);
  });

  // 🔹 Fechar ao clicar fora da área do modal
  document.addEventListener("click", (event) => {
    if (event.target === modal) {
      fecharEstatuto();
    }
  });
});

// 🔹 Função para fechar o Estatuto
function fecharEstatuto() {
  const modal = document.getElementById("modalEstatuto");
  if (modal) modal.style.display = "none";
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
    } else {
      console.warn("⚠️ Elemento 'conteudo-estatuto' não encontrado!");
    }
  } catch (error) {
    console.error("Erro ao carregar o Estatuto:", error);
  }
}

// 🔹 Função de pesquisa no Estatuto
function buscarPalavra() {
  const pesquisaInput = document.getElementById("pesquisa");
  const estatutoContainer = document.getElementById("conteudo-estatuto");

  if (pesquisaInput && estatutoContainer) {
    const termo = pesquisaInput.value.toLowerCase();
    estatutoContainer.innerHTML = estatutoContainer.innerHTML.replace(
      new RegExp(`(${termo})`, "gi"), `<span class="highlight">$1</span>`
    );
  }
}
