document.addEventListener("DOMContentLoaded", async () => {
  const hoje = new Date();
  const inicioSemana = new Date(hoje);
  const diaSemana = hoje.getDay();

  // Corrige para sempre começar na segunda-feira
  inicioSemana.setDate(hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));  

  const semanaAno = obterSemanaISO(inicioSemana);
  console.log("🗓️ Semana ISO do ano:", semanaAno);

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

// 📅 Função para calcular a semana do ano pelo padrão ISO 8601
function obterSemanaISO(data) {
  const dataCorrigida = new Date(data);
  dataCorrigida.setHours(0, 0, 0, 0);

  // Obtém o dia da semana (segunda-feira = 1, domingo = 7)
  const diaSemanaISO = dataCorrigida.getDay() === 0 ? 7 : dataCorrigida.getDay();

  // Ajusta a data para a quinta-feira da mesma semana (ISO 8601 exige isso)
  dataCorrigida.setDate(dataCorrigida.getDate() + (4 - diaSemanaISO));

  const primeiroDiaAno = new Date(dataCorrigida.getFullYear(), 0, 4); // 4 de Janeiro é base ISO
  const diff = dataCorrigida - primeiroDiaAno;
  const msPorSemana = 7 * 24 * 60 * 60 * 1000;

  return Math.floor(diff / msPorSemana) + 1;
}
