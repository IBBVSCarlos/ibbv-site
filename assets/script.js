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