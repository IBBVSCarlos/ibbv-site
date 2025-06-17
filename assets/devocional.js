document.addEventListener("DOMContentLoaded", async () => {
  const hoje = new Date();
  const inicioSemana = new Date(hoje);
  const diaSemana = hoje.getDay();

  // Corrige para sempre começar na segunda-feira
  inicioSemana.setDate(hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));  

  const semanaAno = obterSemanaCorrigida(inicioSemana);
  console.log("🗓️ Semana do ano ajustada:", semanaAno);

  try {
    const res = await fetch("./data/devocional-semana.json");
    if (!res.ok) throw new Error("Arquivo JSON não encontrado ou erro ao carregar");

    const dados = await res.json();
    const chaveSemana = `semana${semanaAno}`;
    console.log("🔑 Chave usada para buscar:", chaveSemana);

    // 📅 Garantir que a semana correta está sendo usada
    if (semanaAno === 25) {
      console.log("✅ Semana 25 identificada corretamente!");
    } else {
      console.warn(`⚠️ Atenção: Semana identificada = ${semanaAno}, esperado = 25!`);
    }

    const devocional = dados[chaveSemana];
    console.log("📖 Devocional retornado:", devocional);

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

// 📅 Função para calcular a semana do ano corretamente com base na segunda-feira
function obterSemanaCorrigida(data) {
  const primeiroDiaAno = new Date(data.getFullYear(), 0, 1);
  const diaSemanaPrimeiro = primeiroDiaAno.getDay();

  // Ajustar para a primeira segunda-feira do ano
  const primeiroSegunda = new Date(primeiroDiaAno);
  primeiroSegunda.setDate(primeiroDiaAno.getDate() + (diaSemanaPrimeiro === 0 ? 1 : 8 - diaSemanaPrimeiro));

  const diff = data - primeiroSegunda;
  const msPorSemana = 7 * 24 * 60 * 60 * 1000;

  return Math.floor(diff / msPorSemana) + 1;
}
