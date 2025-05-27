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

    data.mensagem.forEach((paragrafo, index) => {
      const p = document.createElement('p');
      p.textContent = paragrafo;

      // Último parágrafo é a assinatura
      if (index === data.mensagem.length - 1) {
        p.classList.add('assinatura');
      }

      mensagemDiv.appendChild(p);
    });
  })
  .catch(error => {
    console.error('Erro ao carregar a Coluna do Pastor:', error);
  });
