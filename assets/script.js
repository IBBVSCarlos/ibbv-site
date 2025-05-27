// script.js

//versiculo do dia
//document.addEventListener('DOMContentLoaded', () => {
//fetch('data/versiculos.json')
//  .then(res => res.json())
//  .then(data => {
//    const hoje = new Date().toISOString().slice(0, 10);
//    const versiculoHoje = data.find(v => v.data === hoje);
//    const container = document.getElementById('versiculo')//;

//    if (versiculoHoje) {
//      container.innerHTML = `<p>"${versiculoHoje.texto}" <strong>(${versiculoHoje.referencia})</strong></p><small>${versiculoHoje.comentario}</small>`;
//    } else {
//      container.textContent = 'Versículo não encontrado.';
//    }
//  })
//  .catch(error => console.error('Erro ao carregar versículo:', error));

  // tras o versiculo do dia
async function carregarVersiculoDoDia() {
  try {
    const res = await fetch('data/versiculos.json');
    const versiculos = await res.json();

    const hoje = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD
    const versiculoHoje = versiculos.find(v => v.data === hoje);

    const container = document.getElementById('versiculo');
    if (!container) return;

    // Se encontrar o versículo do dia, exibe na página
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

// Chama a função quando o DOM for carregado
document.addEventListener('DOMContentLoaded', carregarVersiculoDoDia);




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
    const diaSemana = hoje.getDay(); // domingo=0, segunda=1, ...
    
    // Define o início da semana como o último domingo
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - diaSemana);

    // Define o fim da semana como o próximo domingo
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6); // Último dia da semana será domingo

    const lista = document.getElementById("lista-aniversariantes");
    if (!lista) return;

    // Filtra os aniversariantes dentro do intervalo da semana
const aniversariantesSemana = aniversariantes.filter(item => {
  const [dia, mes] = item.data.split('/').map(Number);
  const dataAniv = new Date(hoje.getFullYear(), mes - 1, dia); // Apenas uma vez

  return dataAniv >= inicioSemana && dataAniv < fimSemana;
});



    // Exibe aniversariantes na tela, marcando os aniversariantes do dia com "hoje!"
lista.innerHTML = aniversariantesSemana.length
  ? aniversariantesSemana.map(p => {
      const [dia, mes] = p.data.split('/').map(Number);
      const dataAniv = new Date(hoje.getFullYear(), mes - 1, dia); // Criado dentro do .map()

      const hojeTexto = (dataAniv.getDate() === hoje.getDate() &&
                         dataAniv.getMonth() === hoje.getMonth() &&
                         dataAniv.getFullYear() === hoje.getFullYear()) 
        ? " <strong>(hoje!)</strong>" 
        : "";

      return `<li>${p.nome}${hojeTexto}</li>`;
    }).join('')
  : '<li>Nenhum aniversariante nesta semana.</li>';

  } catch (error) {
    console.error("Erro ao carregar aniversariantes:", error);
  }
}

// Chama a função quando o DOM for carregado
document.addEventListener('DOMContentLoaded', () => {
  carregarAniversariantesSemana();
  loadColunaPastor();
});



// Função para carregar a Coluna do Pastor
async function loadColunaPastor() {
  try {
    const res = await fetch('data/coluna_pastor.json');
    const coluna = await res.json();

    const container = document.getElementById('coluna-pastor');
    if (!container) return;

    const titulo = document.createElement('h2');
    titulo.textContent = coluna.titulo;
    container.appendChild(titulo);

    coluna.mensagem.forEach((paragrafo, index) => {
      const p = document.createElement('p');
      if (index === 0) {
        p.style.fontWeight = 'bold'; // o primeiro parágrafo é o título do texto (separado)
        p.textContent = paragrafo;
      } else if (index === coluna.mensagem.length -1) {
        p.style.fontWeight = 'bold';
        p.style.fontStyle = 'italic'; // última linha assinatura
        p.textContent = paragrafo;
      } else {
        p.style.textAlign = 'justify';
        p.textContent = paragrafo;
      }
      container.appendChild(p);
    });
  } catch (error) {
    console.error('Erro ao carregar coluna do pastor:', error);
  }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  loadAniversariantesSemana();
  loadColunaPastor();
});

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
        
        setTimeout(() => mensagemPix.remove(), 2500); // Remove após 2.5s
    }).catch(() => {
        alert("Erro ao copiar. Copie manualmente: " + chavePix);
    });
}
