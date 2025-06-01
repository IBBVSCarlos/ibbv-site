// Função para carregar a Coluna do Pastor com historico
// 🔹 Função para sanitizar o texto, removendo caracteres especiais
function sanitizarTexto(texto) {
  return texto
    .replace(/[\u201C\u201D]/g, '"')  // Substitui aspas inclinadas por aspas normais
    .replace(/[\u2018\u2019]/g, "'")  // Substitui apóstrofos inclinados por apóstrofos normais
    .replace(/\u2026/g, "..."); // Corrige reticências para padrão de três pontos
}

async function carregarColunaPastorTXT() {
  try {
    const res = await fetch('data/coluna_pastor.txt');
    if (!res.ok) throw new Error("Erro ao carregar o arquivo TXT");

    const texto = await res.text();
    const colunas = [];

    // Separar cada artigo usando "---" e aplicar sanitização
    const blocos = texto.split("---").map(bloco => bloco.trim());

    blocos.forEach((bloco, index) => {
      const linhas = bloco.split("\n").map(linha => sanitizarTexto(linha.trim())).filter(linha => linha);

      if (linhas.length < 2) return; // Ignorar blocos inválidos

      colunas.push({
        id: index + 1,
        titulo: linhas[0], // Título
        mensagem: linhas.slice(1, -1), // Parágrafos
        assinatura: linhas[linhas.length - 1] // Assinatura
      });
    });

    // Exibir no site
    exibirColunaPastor(colunas);

  } catch (error) {
    console.error("Erro ao carregar Coluna do Pastor:", error);
  }
}

function exibirColunaPastor(colunas) {
  if (!colunas.length) {
    document.getElementById("coluna-pastor").innerHTML = "<p>Nenhum conteúdo disponível.</p>";
    return;
  }

  let indiceAtual = 0;
  const titulo = document.querySelector('#coluna-pastor h2');
  const mensagemDiv = document.getElementById('mensagem-pastor');

  if (!titulo || !mensagemDiv) {
    console.error("Elementos da Coluna do Pastor não encontrados.");
    return;
  }

  function atualizarColuna() {
    titulo.textContent = colunas[indiceAtual].titulo;
    mensagemDiv.innerHTML = colunas[indiceAtual].mensagem.map(p => `<p>${p}</p>`).join('') + `<p class="assinatura">${colunas[indiceAtual].assinatura}</p>`;
  }

  atualizarColuna(); // Mostrar o primeiro artigo

  // Verificação antes de adicionar eventos aos botões
  const btnAnterior = document.getElementById("btnAnterior");
  const btnProximo = document.getElementById("btnProximo");

  if (btnAnterior) {
    btnAnterior.addEventListener("click", () => {
      if (indiceAtual > 0) {
        indiceAtual--;
        atualizarColuna();
      }
    });
  }

  if (btnProximo) {
    btnProximo.addEventListener("click", () => {
      if (indiceAtual < colunas.length - 1) {
        indiceAtual++;
        atualizarColuna();
      }
    });
  }
}

// Chamando a função ao carregar a página
document.addEventListener("DOMContentLoaded", carregarColunaPastorTXT);


async function verificarNovaColuna() {
  try {
    const res = await fetch("data/coluna_pastor.txt");
    if (!res.ok) throw new Error("Erro ao carregar a Coluna do Pastor.");

    const textoAtual = await res.text();
    const ultimaColuna = localStorage.getItem("ultimaColunaPastor");

    if (textoAtual !== ultimaColuna) {
      localStorage.setItem("ultimaColunaPastor", textoAtual);

      if ("serviceWorker" in navigator && "Notification" in window) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.sync.register("nova-coluna-pastor");
        });
      }
    }
  } catch (error) {
    console.error("Erro ao verificar nova mensagem na Coluna do Pastor:", error);
  }
}

// Verifica novas colunas regularmente
setInterval(verificarNovaColuna, 60000);



/*document.addEventListener("DOMContentLoaded", () => {
  fetch('data/coluna_pastor.json')
    .then(response => response.json())
    .then(data => {
      const titulo = document.querySelector('#coluna-pastor h2');
      const mensagemDiv = document.getElementById('mensagem-pastor');

      if (!titulo || !mensagemDiv || !data.mensagem?.length) {
        console.warn("Dados ausentes na Coluna do Pastor.");
        return;
      }

      titulo.textContent = data.titulo;
      mensagemDiv.innerHTML = "";

      data.mensagem.forEach((paragrafo, index) => {
        const p = document.createElement('p');
        p.textContent = paragrafo;

        if (index === data.mensagem.length - 1) {
          p.classList.add('assinatura');
        }

        mensagemDiv.appendChild(p);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar a Coluna do Pastor:', error);
    });
});

*/