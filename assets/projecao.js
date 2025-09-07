document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("container");

  try {
    // sobe um nível (..), pois o JSON está em /data
    const res = await fetch("../data/projecao.json");
    const dados = await res.json();

    if (!dados || dados.length === 0) {
      container.textContent = "Nenhuma projeção encontrada.";
      return;
    }

    // Ordena pela data de inclusão (mais recente primeiro)
    const ultimaImagem = dados.sort(
      (a, b) => new Date(b.dt_inclusao) - new Date(a.dt_inclusao)
    )[0];

    // Caminho correto para imagens em /data/midia
    const img = document.createElement("img");
    img.src = `../data/midia/${ultimaImagem.img_name}`;
    img.alt = "Projeção IBBV";
    container.innerHTML = "";
    container.appendChild(img);
  } catch (error) {
    console.error("Erro ao carregar projeção:", error);
    container.textContent = "Erro ao carregar projeção.";
  }
});
