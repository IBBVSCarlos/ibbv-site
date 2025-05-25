document.addEventListener('DOMContentLoaded', () => {
  fetch('data/versiculos.json')
    .then(res => res.json())
    .then(data => {
      const hoje = new Date().toISOString().slice(0, 10);
      const versiculoHoje = data.find(v => v.data === hoje);
      const container = document.getElementById('versiculo-conteudo');
      if (versiculoHoje) {
        container.innerHTML = `<p>"${versiculoHoje.texto}" <strong>(${versiculoHoje.referencia})</strong></p><small>${versiculoHoje.comentario}</small>`;
      } else {
        container.textContent = 'Versículo não encontrado.';
      }
    });

  fetch('data/aniversariantes.json')
    .then(res => res.json())
    .then(data => {
      const hoje = new Date();
      const inicio = new Date(hoje);
      const fim = new Date(hoje);
      fim.setDate(inicio.getDate() + 6);

      const lista = document.getElementById('lista-aniversariantes');
      const aniversariantes = data.filter(pessoa => {
        const [ano, mes, dia] = pessoa.data.split('-').map(Number);
        const dataAniv = new Date(hoje.getFullYear(), mes - 1, dia);
        return dataAniv >= inicio && dataAniv <= fim;
      });

      if (aniversariantes.length) {
        lista.innerHTML = aniversariantes.map(p => `<li>${p.nome} ${p.complemento ? '(' + p.complemento + ')' : ''}</li>`).join('');
      } else {
        lista.innerHTML = '<li>Nenhum aniversariante nesta semana.</li>';
      }
    });
});


// script.js

// Função para formatar a data no formato "dd/mm"
function formatDate(date) {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${d}/${m}`;
}

// Função para obter os aniversariantes da semana
async function loadAniversariantesSemana() {
  try {
    const res = await fetch('data/aniversariantes.json');
    const aniversariantes = await res.json();

    const hoje = new Date();
    const diaSemana = hoje.getDay(); // domingo=0, segunda=1, ...
    // Começo da semana: domingo anterior
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - diaSemana);

    // Fim da semana: sábado seguinte
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);

    const aniversariantesSemana = aniversariantes.filter(item => {
      const [dia, mes] = item.data.split('/').map(Number);
      const dataAtualAno = new Date(hoje.getFullYear(), mes - 1, dia);
      return dataAtualAno >= inicioSemana && dataAtualAno <= fimSemana;
    });

    const container = document.getElementById('aniversariantes-semana');
    if (!container) return;

    if (aniversariantesSemana.length === 0) {
      container.innerHTML = '<p>Nenhum aniversariante nesta semana.</p>';
      return;
    }

    const ul = document.createElement('ul');
    aniversariantesSemana.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.nome;
      ul.appendChild(li);
    });
    container.appendChild(ul);
  } catch (error) {
    console.error('Erro ao carregar aniversariantes:', error);
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

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  loadAniversariantesSemana();
  loadColunaPastor();
});