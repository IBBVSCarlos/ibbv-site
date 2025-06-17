document.addEventListener("DOMContentLoaded", async () => {
  const hoje = new Date();
  const inicioSemana = new Date(hoje);
  const diaSemana = hoje.getDay();

  // ✅ Adianta a lógica: Sempre começa na segunda-feira, mas desloca uma semana para frente
  inicioSemana.setDate(hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1) + 7);  

  const semanaAno = obterSemanaAjustada(inicioSemana);
  console.log("🗓️ Semana do ano ajustada (devocional.js):", semanaAno);

  try {
    const res = await fetch("./data/devocional-semana.json");
    if (!res.ok) throw new Error("Arquivo JSON não encontrado ou erro ao carregar");

    const dados = await res.json();
    const chaveSemana = `semana${semanaAno}`;
    console.log("🔑 Chave usada para buscar:", chaveSemana);

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

// 📅 **Função ajustada para adiantar as semanas**
function obterSemanaAjustada(data) {
  const primeiroDiaAno = new Date(data.getFullYear(), 0, 1);
  const diaSemanaPrimeiro = primeiroDiaAno.getDay();

  // Ajusta para primeira segunda-feira do ano
  const primeiroSegunda = new Date(primeiroDiaAno);
  primeiroSegunda.setDate(primeiroDiaAno.getDate() + (diaSemanaPrimeiro === 0 ? 1 : 8 - diaSemanaPrimeiro));

  const diff = data - primeiroSegunda;
  const msPorSemana = 7 * 24 * 60 * 60 * 1000;

  return Math.floor(diff / msPorSemana) + 1;
}
