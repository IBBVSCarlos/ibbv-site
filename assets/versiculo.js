document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("versiculo-conteudo");

  if (!container) {
    console.warn("Elemento 'versiculo-conteudo' não encontrado.");
    return;
  }

  try {
    const resposta = await fetch("data/versiculos.json");
    if (!resposta.ok) throw new Error("Erro ao carregar versículos");

    const versiculos = await resposta.json();

    const hoje = new Date();
    const dataHoje = hoje.toISOString().split("T")[0];

    const versiculoHoje = versiculos.find(v => v.data === dataHoje);

    if (!versiculoHoje) {
      container.innerHTML = "<p>⚠️ Versículo não encontrado para hoje.</p>";
      return;
    }

    const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const diaSemana = diasSemana[hoje.getDay()];
    const dia = String(hoje.getDate()).padStart(2, "0");
    const mes = meses[hoje.getMonth()];
    const dataFormatada = `${diaSemana}, ${dia} de ${mes}`;

    container.innerHTML = `
      <p><strong>Hoje é ${dataFormatada} e este é o versículo para hoje:</strong></p>
      <blockquote>
        <p>"${versiculoHoje.texto}"</p>
        <footer>📖 ${versiculoHoje.livro} ${versiculoHoje.capitulo}:${versiculoHoje.versiculo} (ACF)</footer>
      </blockquote>
    `;
  } catch (erro) {
    console.error("Erro ao buscar o versículo:", erro);
    container.innerHTML = "<p>⚠️ Erro ao carregar o versículo do dia.</p>";
  }
});