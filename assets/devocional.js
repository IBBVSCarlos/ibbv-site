// assets/devocional.js

document.addEventListener("DOMContentLoaded", async () => {
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda, etc.

  // Calcula a segunda-feira da semana atual (considerando domingo como 0)
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1)); 

  const semanaAno = obterSemanaDoAno(inicioSemana);
  console.log("🗓️ Semana do ano:", semanaAno);

  try {
    const res = await fetch("./data/devocional-semana.json");
    if (!res.ok) throw new Error("Arquivo JSON não encontrado ou erro ao carregar");

    const dados = await res.json();
    const chaveSemana = `semana${semanaAno}`;
    console.log("🔑 Chave usada para buscar:", chaveSemana);
    
    const devocional = dados[chaveSemana];
    console.log("📖 Devocional retornado:", devocional); // 👈 agora está no lugar certo

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
    document.getElementById("conteudo-devocional").innerHTML = '<p>Erro ao carregar devocional. Tente novamente mais tarde.</p>';
  }
});

// Função para calcular a semana do ano considerando segunda como primeiro dia da semana
function obterSemanaDoAno(data) {
  const dia = data.getDay() === 0 ? 6 : data.getDay() - 1;
  const dataCorrigida = new Date(data);
  dataCorrigida.setDate(dataCorrigida.getDate() - dia); // última segunda

  const primeiroDiaAno = new Date(dataCorrigida.getFullYear(), 0, 1);
  const primeiroDiaAnoDia = primeiroDiaAno.getDay() === 0 ? 6 : primeiroDiaAno.getDay() - 1;

  const primeiroSegundaAno = new Date(primeiroDiaAno);
  primeiroSegundaAno.setDate(primeiroDiaAno.getDate() + (7 - primeiroDiaAnoDia));

  const diff = dataCorrigida - primeiroSegundaAno;
  const msPorSemana = 7 * 24 * 60 * 60 * 1000;

  return diff >= 0 ? Math.floor(diff / msPorSemana) + 1 : 1;
}
