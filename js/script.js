document.addEventListener("DOMContentLoaded", () => {
  const dataAtual = new Date();
  const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR', opcoes);
  document.getElementById('semana-info').textContent = dataFormatada;
});
