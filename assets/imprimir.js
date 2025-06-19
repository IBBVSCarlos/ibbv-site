// imprimir.js (atualizado para carregar de coluna_pastor.txt)

function preencherSemanaAtual() {
  const hoje = new Date();
  const diaSemana = hoje.getDay();
  const inicio = new Date(hoje);
  inicio.setDate(hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1)); // segunda
  const fim = new Date(inicio);
  fim.setDate(inicio.getDate() + 6);

  const mes = inicio.toLocaleString("pt-BR", { month: "long" });
  const ano = inicio.getFullYear();
  const periodo = `Semana de ${inicio.getDate()} a ${fim.getDate()} de ${mes} de ${ano}`;
  document.getElementById("semana-atual").textContent = periodo;
}

async function carregarColunasDoPastor() {
  try {
    const res = await fetch("../data/coluna_pastor.txt");
    const texto = await res.text();

    const colunas = texto
      .split("\n---\n") // separador entre textos
      .map((bloco, i) => {
        const [titulo, ...paragrafos] = bloco.trim().split("\n");
        return {
          id: i,
          titulo: titulo.replace(/^#\s*/, "").trim(),
          texto: paragrafos.join("\n")
        };
      });

    preencherListaColunas(colunas);
  } catch (erro) {
    console.error("Erro ao carregar coluna do pastor:", erro);
  }
}

function preencherListaColunas(colunas) {
  const select = document.getElementById("coluna-select");
  const container = document.getElementById("coluna-pastor");

  colunas.forEach(col => {
    const option = document.createElement("option");
    option.value = col.id;
    option.textContent = col.titulo;
    select.appendChild(option);
  });

  // evento de mudança
  select.addEventListener("change", (e) => {
    const selecionada = colunas.find(c => c.id == e.target.value);
    if (selecionada) {
      container.innerHTML = `
        <h3>${selecionada.titulo}</h3>
        <p>${selecionada.texto.replace(/\n/g, "<br>")}</p>
      `;
    }
  });

  // seleciona primeira por padrão
  if (colunas.length > 0) {
    select.value = colunas[0].id;
    select.dispatchEvent(new Event("change"));
  }
}

function prepararParaImpressao() {
  window.print();
}

// Inicializa conteúdo ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  preencherSemanaAtual();
  carregarColunasDoPastor();

  const btnImprimir = document.getElementById("print-now");
  if (btnImprimir) {
    btnImprimir.addEventListener("click", prepararParaImpressao);
  }
});
