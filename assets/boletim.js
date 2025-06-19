// =====================================
// 🎨 Semana Referência (mesmo cálculo do site principal)
// =====================================
function definirSemanaReferencia() {
  const hoje = new Date();
  const diaSemana = hoje.getDay();

  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));

  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(inicioSemana.getDate() + 6);

  const opcoesDiaMes = { day: "2-digit", month: "long" };
  const inicioFormatado = inicioSemana.toLocaleDateString("pt-BR", opcoesDiaMes);
  const fimFormatado = fimSemana.toLocaleDateString("pt-BR", opcoesDiaMes);
  const mesInicio = inicioSemana.toLocaleDateString("pt-BR", { month: "long" });
  const mesFim = fimSemana.toLocaleDateString("pt-BR", { month: "long" });

  const semanaTexto = mesInicio === mesFim
    ? `${inicioSemana.getDate()} a ${fimSemana.getDate()} de ${mesInicio}`
    : `${inicioFormatado} a ${fimFormatado}`;

  const semanaReferenciaElemento = document.getElementById("semana-referencia");
  if (semanaReferenciaElemento) {
    semanaReferenciaElemento.textContent = semanaTexto;
  }
}

// ==============================
// 📖 Devocional da Semana
// ==============================
async function carregarDevocional() {
  try {
    const res = await fetch('data/devocional.json'); // você pode usar outro nome se quiser
    const dados = await res.json();

    const hoje = new Date();
    const diaSemana = hoje.getDay();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));

    // Procurar devocional correspondente à semana (baseado no ISO ou data de início)
    const devocionalAtual = dados.find(d => new Date(d.inicio) <= hoje && new Date(d.fim) >= hoje);

    const devocionalElemento = document.getElementById("texto-devocional");
    if (devocionalAtual && devocionalElemento) {
      devocionalElemento.textContent = devocionalAtual.texto;
    } else {
      devocionalElemento.textContent = "Devocional não disponível para esta semana.";
    }
  } catch (error) {
    console.error("Erro ao carregar devocional:", error);
  }
}

document.addEventListener("DOMContentLoaded", carregarDevocional);
// =====================================
// 🎉 Carregar aniversariantes da semana (adaptado)
// =====================================
async function carregarAniversariantesSemana() {
  try {
    const res = await fetch('data/aniversariantes.json');
    const aniversariantes = await res.json();
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 7);
    const emojis = ["🎉", "🎂", "🥳", "🎊", "🍰", "🎈", "✨", "😃"];

    const aniversariantesSemana = aniversariantes.filter(({ data }) => {
      const [dia, mes] = data.split('/').map(Number);
      const dataAniv = new Date(hoje.getFullYear(), mes - 1, dia);
      return dataAniv >= inicioSemana && dataAniv <= fimSemana;
    });

    const lista = document.getElementById("lista-aniversariantes");
    if (!lista) return;

    lista.innerHTML = aniversariantesSemana.length
      ? aniversariantesSemana.map(p => {
          const hojeTexto = new Date().toLocaleDateString("pt-BR") === p.data ? " <strong>(hoje!)</strong>" : "";
          return `<li>${emojis[Math.floor(Math.random() * emojis.length)]} ${p.nome}${hojeTexto}</li>`;
        }).join("")
      : '<li>Nenhum aniversariante nesta semana.</li>';
  } catch (error) {
    console.error("Erro ao carregar aniversariantes:", error);
  }
}

// =====================================
// 📢 Carregar avisos (simplificado)
// =====================================
async function carregarAvisos() {
  try {
    const res = await fetch('data/avisosibbv.json');
    const { avisos } = await res.json();

    const lista = document.getElementById('lista-avisos');
    if (!lista) return;

    lista.innerHTML = avisos.length
      ? avisos.map(({ texto }) => `<li class="aviso-item"><p>${texto}</p></li>`).join("")
      : '<li>Nenhum aviso disponível.</li>';
  } catch (error) {
    console.error("Erro ao carregar avisos:", error);
  }
}

// =====================================
// 🎨 Carregar programação (supondo arquivo JSON)
// =====================================
async function carregarProgramacao() {
  try {
    const res = await fetch('data/programacao.json');
    const programacao = await res.json();

    const lista = document.getElementById('lista-programacao');
    if (!lista) return;

    lista.innerHTML = programacao.length
      ? programacao.map(item => `<li>${item}</li>`).join("")
      : '<li>Nenhuma programação disponível.</li>';
  } catch (error) {
    console.error("Erro ao carregar programação:", error);
  }
}

// =====================================
// 📖 Carregar coluna do pastor (texto .txt, já com seletor no boletim)
// =====================================
async function carregarColunasDoPastor() {
  try {
    const res = await fetch('data/coluna_pastor.txt');
    if (!res.ok) throw new Error("Erro ao carregar coluna do pastor.");
    const textoCompleto = await res.text();

    // Assume que os textos estão separados por '---' (ou outro separador, adapte se precisar)
    const colunas = textoCompleto.split('---').map(t => t.trim()).filter(Boolean);

    const seletor = document.getElementById('seletor-coluna-pastor');
    const areaTexto = document.getElementById('texto-coluna-pastor');

    if (!seletor || !areaTexto) return;

    // Preenche o seletor
    seletor.innerHTML = colunas.map((_, i) => `<option value="${i}">Coluna do Pastor - Parte ${i + 1}</option>`).join('');

    // Mostrar o primeiro texto inicialmente
    areaTexto.textContent = colunas[0] || "";

    // Trocar texto ao mudar seleção
    seletor.addEventListener('change', (e) => {
      const idx = parseInt(e.target.value, 10);
      areaTexto.textContent = colunas[idx] || "";
    });

  } catch (error) {
    console.error(error);
  }
}

// =====================================
// Inicialização do boletim
// =====================================
window.addEventListener('DOMContentLoaded', () => {
  definirSemanaReferencia();
  carregarProgramacao();
  carregarAvisos();
  carregarAniversariantesSemana();
  carregarColunasDoPastor();

  // Configurar botão imprimir
  const btnImprimir = document.getElementById('print-now');
  if (btnImprimir) {
    btnImprimir.addEventListener('click', () => {
      // Ajuste visual, remover botão do print etc, depois imprime
      window.print();
    });
  }
});
