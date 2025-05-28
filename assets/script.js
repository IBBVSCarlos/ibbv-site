// script.js
// funçao para o header - semana atual
function definirSemanaReferencia() {
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0 = Domingo, 6 = Sábado

// Efeito de luz no logo do header 
document.addEventListener("DOMContentLoaded", () => {
  const light = document.querySelector(".light-effect");
  
  light.addEventListener("animationend", () => {
    light.style.transition = "0.5s ease-out";
    light.style.transform = "scale(2)";
    light.style.opacity = "0";
    setTimeout(() => {
      light.style.transform = "scale(1)";
      light.style.opacity = "1";
    }, 500);
  });
});


  // scrool na area visivel
window.addEventListener("load", () => {
  const sections = document.querySelectorAll(".section-box");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show"); // Adiciona a classe quando entra na tela
      } else {
        entry.target.classList.remove("show"); // Remove a classe quando sai da tela
      }
    });
  }, { threshold: 0.2 });

  sections.forEach((section) => observer.observe(section));
});


  // Último domingo
  const domingo = new Date(hoje);
  domingo.setDate(hoje.getDate() - diaSemana);
  
  // Próximo sábado
  const sabado = new Date(domingo);
  sabado.setDate(domingo.getDate() + 6);

  // Pegando o dia e o mês
  const diaInicio = domingo.getDate();
  const mesInicio = domingo.toLocaleDateString('pt-BR', { month: 'long' });
  const diaFim = sabado.getDate();
  const mesFim = sabado.toLocaleDateString('pt-BR', { month: 'long' });

  // Se ambos os dias estão no mesmo mês, não repete o nome
  const periodo = mesInicio === mesFim 
    ? `Semana de ${diaInicio} a ${diaFim} de ${mesInicio}`
    : `Semana de ${diaInicio} de ${mesInicio} a ${diaFim} de ${mesFim}`;

  document.getElementById("semana-referencia").textContent = periodo;
}

// Chamando a função quando a página carrega
document.addEventListener("DOMContentLoaded", definirSemanaReferencia);

//versiculo do dia
// tras o versiculo do dia
async function carregarVersiculoDoDia() {
  try {
    const res = await fetch('data/versiculos.json');
    const versiculos = await res.json();

    const hoje = new Date().toISOString().slice(0, 10);
    const versiculoHoje = versiculos.find(v => v.data === hoje);

    const container = document.getElementById('versiculo-conteudo'); // Corrigido!
    if (!container) return;

    if (versiculoHoje) {
      container.innerHTML = `
        <h2>Versículo do Dia</h2>
        <p>"${versiculoHoje.texto}" <strong>(${versiculoHoje.referencia})</strong></p>
        <small>${versiculoHoje.comentario}</small>
      `;
    } else {
      container.innerHTML = '<h2>Versículo do Dia</h2><p>Versículo não encontrado.</p>';
    }
  } catch (error) {
    console.error("Erro ao carregar versículo:", error);
  }
}


// Função para formatar a data no formato "dd/mm"
function formatDate(date) {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${d}/${m}`;
}

// Função para obter os aniversariantes da semana
async function carregarAniversariantesSemana() {
  try {
    const res = await fetch('data/aniversariantes.json');
    const aniversariantes = await res.json();

    const hoje = new Date();
    const diaSemana = hoje.getDay();
    
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - diaSemana);

    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);

    const lista = document.getElementById("lista-aniversariantes");
    if (!lista) return;

const aniversariantesSemana = aniversariantes.filter(item => {
  const [dia, mes] = item.data.split('/').map(Number);
  const dataAniv = new Date(hoje.getFullYear(), mes - 1, dia);
  return dataAniv >= inicioSemana && dataAniv <= fimSemana;
});

    // Array com emojis Unicode aleatórios
    const emojis = ["🎉", "🎂", "🥳", "🎊", "🍰", "🎈", "✨", "😃"];

    lista.innerHTML = aniversariantesSemana.length
      ? aniversariantesSemana.map(p => {
          const [dia, mes] = p.data.split('/').map(Number);
          const dataAniv = new Date(hoje.getFullYear(), mes - 1, dia);
          const hojeTexto = (dataAniv.getDate() === hoje.getDate() &&
                             dataAniv.getMonth() === hoje.getMonth() &&
                             dataAniv.getFullYear() === hoje.getFullYear()) 
            ? " <strong>(hoje!)</strong>" 
            : "";
          
          // Escolhe um emoji aleatório
          const emojiAleatorio = emojis[Math.floor(Math.random() * emojis.length)];

          return `<li>${emojiAleatorio} ${p.nome}${hojeTexto}</li>`;
        }).join('')
      : '<li>Nenhum aniversariante nesta semana.</li>';
  } catch (error) {
    console.error("Erro ao carregar aniversariantes:", error);
  }
}

// Função para carregar a Escala de Ministérios
async function carregarEscalaMinisterios() {
  try {
    const res = await fetch('data/escalamin.json');
    const escala = await res.json();

    const listaEscala = document.getElementById("lista-escala");
    if (!listaEscala) return;

    listaEscala.innerHTML = escala.length
    ? escala.map(ministerio => `<li><strong>${ministerio.nome}</strong> - ${ministerio.atividade}: ${ministerio.dias.join(', ')}</li>`).join('')
    : '<li>Nenhuma escala disponível no momento.</li>';

  } catch (error) {
    console.error("Erro ao carregar escala de ministérios:", error);
  }
}

// Chamando a função ao carregar a página
document.addEventListener("DOMContentLoaded", carregarEscalaMinisterios);

// Avisos IBBV
function carregarAvisos() {
  fetch('data/avisosibbv.json')
    .then(response => response.json())
    .then(data => {
      const listaAvisos = document.getElementById('lista-avisos');

      if (!listaAvisos || !data.avisos?.length) {
        console.warn("Nenhum aviso encontrado.");
        return;
      }

      listaAvisos.innerHTML = ""; // Limpa avisos anteriores

      data.avisos.forEach(aviso => {
        const li = document.createElement('li');
        li.classList.add('aviso-item');

        const texto = document.createElement('p');
        texto.textContent = aviso.texto; // 🚀 Corrigido: agora exibe apenas o texto do aviso
        li.appendChild(texto);

        if (aviso.imagem) {
          const img = document.createElement('img');
          img.src = `img/${aviso.imagem}`; // Ajustado para a nova pasta
          img.alt = "Imagem do aviso";
          img.classList.add('aviso-img');
          li.appendChild(img);
        }

        listaAvisos.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar os avisos:', error);
    });
}

// Chamar a função ao carregar a página
document.addEventListener("DOMContentLoaded", carregarAvisos);


// Função para carregar a Coluna do Pastor com historico
let indiceAtual = 0;
let colunas = [];

function carregarColunasPastor() {
  fetch('data/coluna_pastor.json')
    .then(response => response.json())
    .then(data => {
      colunas = data.colunas;
      exibirColuna(indiceAtual);
    })
    .catch(error => console.error('Erro ao carregar colunas:', error));
}

function exibirColuna(indice) {
  const titulo = document.querySelector('#coluna-pastor h2');
  const mensagemDiv = document.getElementById('mensagem-pastor');

  if (!titulo || !mensagemDiv || !colunas[indice]) return;

  titulo.textContent = colunas[indice].titulo;
  mensagemDiv.innerHTML = "";

  colunas[indice].mensagem.forEach((paragrafo) => {
    const p = document.createElement('p');
    p.textContent = paragrafo;
    mensagemDiv.appendChild(p);
  });
}

document.getElementById("btnAnterior").addEventListener("click", () => {
  if (indiceAtual > 0) {
    indiceAtual--;
    exibirColuna(indiceAtual);
  }
});

document.getElementById("btnProximo").addEventListener("click", () => {
  if (indiceAtual < colunas.length - 1) {
    indiceAtual++;
    exibirColuna(indiceAtual);
  }
});

// Chamar a função ao carregar a página
document.addEventListener("DOMContentLoaded", carregarColunasPastor);


  // Função para o pix
function copiarPix() {
    const chavePix = "57722761000174";
    navigator.clipboard.writeText(chavePix).then(() => {
        const mensagemPix = document.createElement("p");
        mensagemPix.style.color = "#006600";
        mensagemPix.style.fontWeight = "bold";
        mensagemPix.textContent = "Chave Pix copiada!";
        
        const pixLink = document.querySelector(".pix-link");
        pixLink.appendChild(mensagemPix); // Adiciona mensagem temporária
        
        setTimeout(() => mensagemPix.classList.add("fade-out"), 2000);
        setTimeout(() => mensagemPix.remove(), 2500);
 
    }).catch(() => {
        alert("Erro ao copiar. Copie manualmente: " + chavePix);
    });
}

// Chama as funções quando o DOM for carregado
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await carregarVersiculoDoDia();
    await carregarAniversariantesSemana();
/*    await loadColunaPastor(); -- Já está chamado no coluna_pastor.js */
  } catch (error) {
    console.error("Erro ao carregar o conteúdo:", error);
  }
});
