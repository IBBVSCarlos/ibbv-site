// ==============================
// 📖 Devocional da Semana
// ==============================
function obterSemanaAjustada(data) {
  const primeiroDiaAno = new Date(data.getFullYear(), 0, 1);
  const diaSemanaPrimeiro = primeiroDiaAno.getDay();
  const primeiroSegunda = new Date(primeiroDiaAno);
  primeiroSegunda.setDate(primeiroDiaAno.getDate() + (diaSemanaPrimeiro === 0 ? 1 : 8 - diaSemanaPrimeiro));
  const diff = data - primeiroSegunda;
  const msPorSemana = 7 * 24 * 60 * 60 * 1000;
  return Math.floor(diff / msPorSemana) + 1;
}

async function carregarDevocional() {
  const hoje = new Date();
  const inicioSemana = new Date(hoje);
  const diaSemana = hoje.getDay();
  inicioSemana.setDate(hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));

  const semana = obterSemanaAjustada(inicioSemana);
  const chave = `semana${semana}`;

  try {
    const res = await fetch('data/devocional-semana.json');
    if (!res.ok) throw new Error("Erro ao carregar JSON de devocionais");

    const dados = await res.json();
    const devocional = dados[chave];

    const tituloEl = document.getElementById("devocional-titulo");
    const refEl = document.getElementById("devocional-referencia");
    const textoEl = document.getElementById("devocional-texto");
    const msgEl = document.getElementById("devocional-mensagem");

    if (devocional && tituloEl && refEl && textoEl && msgEl) {
      tituloEl.textContent = devocional.titulo;
      refEl.textContent = `Referência: ${devocional.referencia}`;
      textoEl.textContent = `"${devocional.versiculo}"`;
      msgEl.textContent = devocional.mensagem;
    } else {
      document.getElementById("conteudo-devocional").innerHTML = '<p>Devocional não disponível para esta semana.</p>';
    }
  } catch (erro) {
    console.error("Erro ao carregar devocional:", erro);
    document.getElementById("conteudo-devocional").innerHTML = '<p>Erro ao carregar devocional. Tente novamente mais tarde.</p>';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  definirSemanaReferencia();
  carregarProgramacao();
  carregarAvisos();
  carregarAniversariantesSemana();
  carregarColunasDoPastor();
  carregarDevocional(); // 👈 incluído aqui!

  const btnImprimir = document.getElementById('print-now');
  if (btnImprimir) {
    btnImprimir.addEventListener('click', () => {
      window.print();
    });
  }
});
