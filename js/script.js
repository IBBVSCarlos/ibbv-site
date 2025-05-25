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

// Aniversariantes da semana
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
      const data = new Date(pessoa.data + 'T00:00:00');
      return data >= domingo && data <= sabado;
    });
    const ul = document.getElementById('lista-aniversariantes');
    ul.innerHTML = aniversariantes.length
      ? aniversariantes.map(p => `<li>${p.nome} - ${new Date(p.data + 'T00:00:00').toLocaleDateString('pt-BR')}</li>`).join('')
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

// Calendário
fetch('data/conteudo.json')
  .then(res => res.json())
  .then(dados => {
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
