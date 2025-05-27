// script.js
// funçao para o header - semana atual
function definirSemanaReferencia() {
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0 = Domingo, 6 = Sábado
  
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
