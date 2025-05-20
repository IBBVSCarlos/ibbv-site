// Inicialização de animações
AOS.init();

// Atualiza a data da semana
(function atualizarSemana() {
  const hoje = new Date();
  const diaDaSemana = hoje.getDay();
  const domingo = new Date(hoje);
  domingo.setDate(hoje.getDate() - diaDaSemana);
  const sabado = new Date(domingo);
  sabado.setDate(domingo.getDate() + 6);
  const semanaTexto = `Semana de ${domingo.getDate()} a ${sabado.getDate()} de ${sabado.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
  document.getElementById('semana').textContent = semanaTexto;
})();

// Versículo do dia
fetch('data/versiculos_completos.json')
  .then(res => res.json())
  .then(json => {
    const hoje = new Date();
    const diaAno = Math.floor((hoje - new Date(hoje.getFullYear(), 0, 0)) / 86400000);
    const versiculo = json[diaAno - 1];
    const container = document.querySelector('#versiculo-conteudo');
    container.innerHTML = `
      <p class="texto">"${versiculo.texto}"</p>
      <span class="referencia">— ${versiculo.referencia}</span>
      <p class="comentario">${versiculo.comentario}</p>
    `;
  })
  .catch(() => {
    document.querySelector('#versiculo-conteudo').innerHTML = '<p>Não foi possível carregar o versículo do dia.</p>';
  });

// Aniversariantes da semana (com ícone aleatório)
fetch('data/aniversariantes.json')
  .then(res => res.json())
  .then(lista => {
    const hoje = new Date();
    const diaDaSemana = hoje.getDay();
    const domingo = new Date(hoje);
    domingo.setDate(hoje.getDate() - diaDaSemana);
    const sabado = new Date(domingo);
    sabado.setDate(domingo.getDate() + 6);

    const aniversariantes = lista.filter(pessoa => {
      const [dia, mes] = pessoa.data.split('/');
      const data = new Date(hoje.getFullYear(), parseInt(mes) - 1, parseInt(dia));
      return data >= domingo && data <= sabado;
    });

    // Lista de imagens de festa aleatórias (URLs externas)
    const iconesFesta = [
      'https://cdn-icons-png.flaticon.com/512/3159/3159066.png',
      'https://cdn-icons-png.flaticon.com/512/869/869869.png',
      'https://cdn-icons-png.flaticon.com/512/3461/3461807.png',
      'https://cdn-icons-png.flaticon.com/512/524/524239.png',
      'https://cdn-icons-png.flaticon.com/512/742/742751.png'
    ];

    const ul = document.getElementById('lista-aniversariantes');
    ul.innerHTML = aniversariantes.length
      ? aniversariantes.map(p => {
          const iconURL = iconesFesta[Math.floor(Math.random() * iconesFesta.length)];
          return `<li><img src="${iconURL}" alt="🎉" class="icone-aniversario"> ${p.nome}</li>`;
        }).join('')
      : '<li>Nenhum aniversariante nesta semana.</li>';
  })
  .catch(() => {
    document.getElementById('lista-aniversariantes').innerHTML = '<li>Erro ao carregar aniversariantes.</li>';
  });

// Formulário de oração
document.getElementById('form-oracao').addEventListener('submit', function (e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const motivo = document.getElementById('motivo').value.trim();
  const mensagem = document.getElementById('mensagem-envio');
  if (!nome || !motivo) {
    mensagem.textContent = "Por favor, preencha todos os campos.";
    mensagem.style.color = "#ff5555";
    return;
  }
  fetch('https://script.google.com/macros/s/AKfycbyCwxBbDqHHaali9lByn1vhvuCnV830lWLIwLW_07nI-tmislO5dAGJbtzC-XMy624v/exec', {
    method: 'POST',
    body: JSON.stringify({ nome, motivo }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(data => {
    mensagem.textContent = data.resultado === "sucesso" ? "Pedido enviado com sucesso!" : "Erro ao enviar. Tente novamente.";
    mensagem.style.color = data.resultado === "sucesso" ? "#66bb6a" : "#ff5555";
    if (data.resultado === "sucesso") document.getElementById('form-oracao').reset();
  })
  .catch(() => {
    mensagem.textContent = "Erro na conexão. Verifique sua internet.";
    mensagem.style.color = "#ff5555";
  });
});

// Programação e eventos no calendário
fetch('data/conteudo.json')
  .then(res => res.json())
  .then(dados => {
    console.log('Eventos carregados:', dados.eventos);
    const listaProgramacao = document.querySelector('#programacao ul');
    listaProgramacao.innerHTML = (dados.programacao || []).map(item => `<li>${item}</li>`).join('');
    document.querySelector('#oracao p').textContent = dados.oracao || 'Pedidos de oração não disponíveis.';
const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
  initialView: 'dayGridMonth',
  height: 500,
  locale: 'pt-br',
  events: dados.eventos || []
});
calendar.render();
  })
  .catch(err => console.error('Erro ao carregar conteudo.json:', err));
