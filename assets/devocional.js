// assets/devocional.js

document.addEventListener("DOMContentLoaded", async () => {
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda, etc.
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1)); // segunda-feira da semana

  const semanaAno = obterSemanaDoAno(inicioSemana); // mesmo princípio do cabeçalho

  try {
    const res = await fetch("assets/devocional-semanal.json");
    const dados = await res.json();
    const devocional = dados[`semana${semanaAno}`];

    if (devocional) {
      document.getElementById("devocional-titulo").textContent = devocional.titulo;
      document.getElementById("devocional-referencia").textContent = `Referência: ${devocional.referencia}`;
      document.getElementById("devocional-texto").textContent = `"${devocional.versiculo}"`;
      document.getElementById("devocional-mensagem").textContent = devocional.mensagem;
    } else {
      document.getElementById("conteudo-devocional").innerHTML = '<p>Devocional não disponível para esta semana.</p>';
    }
  } catch (erro) {
    console.error("Erro ao carregar devocional:", erro);
  }
});

// Função compatível com o padrão da sua semana
function obterSemanaDoAno(data) {
  const primeiroDiaAno = new Date(data.getFullYear(), 0, 1);
  const dias = Math.floor((data - primeiroDiaAno) / (24 * 60 * 60 * 1000));
  return Math.ceil((dias + primeiroDiaAno.getDay() + 1) / 7);
}
