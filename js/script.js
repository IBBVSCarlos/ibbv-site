document.addEventListener("DOMContentLoaded", () => {
  // Atualiza data da semana no header
  const semanaEl = document.getElementById("semana");
  if (semanaEl) {
    const hoje = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    semanaEl.textContent = hoje.toLocaleDateString('pt-BR', options);
  }

  // Função para carregar JSON via fetch e inserir texto em elemento
  async function carregarJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro ao carregar ${url}: ${response.status}`);
    return response.json();
  }

  // Carregar versículo do dia
  carregarJson('data/versiculo.json')
    .then(data => {
      const versiculoConteudo = document.getElementById("versiculo-conteudo");
      if (!versiculoConteudo) return;

      versiculoConteudo.innerHTML = `
        <span class="texto">"${data.texto}"</span>
        <span class="referencia">${data.referencia}</span>
        ${data.comentario ? `<span class="comentario">${data.comentario}</span>` : ''}
      `;
    })
    .catch(err => console.error(err));

  // Carregar aniversariantes da semana
  carregarJson('data/aniversariantes.json')
    .then(data => {
      const lista = document.getElementById("lista-aniversariantes");
      if (!lista) return;

      lista.innerHTML = ''; // limpa

      if (data.length === 0) {
        lista.innerHTML = '<li>Nenhum aniversariante nesta semana.</li>';
        return;
      }

      data.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.nome} (${item.data})`;
        lista.appendChild(li);
      });
    })
    .catch(err => console.error(err));

  // Carregar programação
  carregarJson('data/programacao.json')
    .then(data => {
      const programacaoLista = document.querySelector(".programacao-lista");
      if (!programacaoLista) return;

      programacaoLista.innerHTML = ''; // limpa

      if (data.length === 0) {
        programacaoLista.innerHTML = '<li>Sem programação para esta semana.</li>';
        return;
      }

      data.forEach(evento => {
        const li = document.createElement("li");
        li.textContent = `${evento.dia} - ${evento.hora} - ${evento.descricao}`;
        programacaoLista.appendChild(li);
      });
    })
    .catch(err => console.error(err));

  // Pedidos de oração: carregar e enviar
  const oracaoPedidos = document.getElementById("oracao-pedidos");
  const formOracao = document.getElementById("form-oracao");
  const mensagemEnvio = document.getElementById("mensagem-envio");

  async function carregarPedidos() {
    try {
      const data = await carregarJson('data/pedidos_oracao.json');
      if (!oracaoPedidos) return;

      if (data.length === 0) {
        oracaoPedidos.textContent = 'Nenhum pedido de oração até o momento.';
        return;
      }

      oracaoPedidos.innerHTML = data.map(pedido =>
        `<p><strong>${pedido.nome}:</strong> ${pedido.motivo}</p>`
      ).join('');
    } catch (e) {
      console.error(e);
      if (oracaoPedidos) oracaoPedidos.textContent = 'Erro ao carregar pedidos.';
    }
  }

  carregarPedidos();

  if (formOracao) {
    formOracao.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nome = formOracao.nome.value.trim();
      const motivo = formOracao.motivo.value.trim();

      if (!nome || !motivo) {
        mensagemEnvio.textContent = 'Por favor, preencha todos os campos.';
        mensagemEnvio.style.color = 'red';
        return;
      }

      mensagemEnvio.textContent = 'Enviando...';
      mensagemEnvio.style.color = 'var(--verde-claro)';

      // Aqui você pode integrar com backend ou Google Sheets via API
      // Como exemplo, simulo envio e atualização local:

      try {
        // Simulação de delay de envio
        await new Promise(res => setTimeout(res, 1000));

        // Atualiza localmente a lista (em produção, deve vir do servidor)
        if (oracaoPedidos) {
          oracaoPedidos.innerHTML += `<p><strong>${nome}:</strong> ${motivo}</p>`;
        }

        formOracao.reset();
        mensagemEnvio.textContent = 'Pedido enviado com sucesso!';
        mensagemEnvio.style.color = 'var(--verde-claro)';
      } catch (err) {
        console.error(err);
        mensagemEnvio.textContent = 'Erro ao enviar pedido.';
        mensagemEnvio.style.color = 'red';
      }
    });
  }

  // Inicializar FullCalendar
  const calendarEl = document.getElementById('calendar');
  if (calendarEl) {
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'pt-br',
      events: 'data/eventos.json', // seu arquivo JSON com eventos
      height: 'auto',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      themeSystem: 'standard'
    });
    calendar.render();
  }

  // Inicializar AOS (animações)
  if (window.AOS) {
    AOS.init();
  }
});
