fetch('data/aniversariantes.json')
  .then(response => response.json())
  .then(data => {
    const lista = document.getElementById('lista-aniversariantes');
    data.forEach(pessoa => {
      const item = document.createElement('li');
      item.innerHTML = `
        <img src="img/icone-aniversario.png" class="icone-aniversario" alt="🎂">
        ${pessoa.nome}
        <img src="https://source.unsplash.com/30x30/?funny,smile,celebration&sig=${Math.random()}" alt="Foto engraçada" style="border-radius:50%;margin-left:auto;">
      `;
      lista.appendChild(item);
    });
  });
