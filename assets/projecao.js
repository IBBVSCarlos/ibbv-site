document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("container");

  try {
    const res = await fetch("../data/projecao.json");
    const dados = await res.json();

    if (!dados || dados.length === 0) {
      container.textContent = "Nenhuma projeção encontrada.";
      return;
    }

    // Descobre a data mais recente
    const datas = dados.map(item => new Date(item.dt_inclusao));
    const maxData = new Date(Math.max.apply(null, datas));

    // Filtra todas as imagens com a mesma data
    const imagensRecentes = dados.filter(
      item => new Date(item.dt_inclusao).getTime() === maxData.getTime()
    );

    // Limpa container
    container.innerHTML = "";

    // Exibe todas as imagens (lado a lado ou empilhadas)
    imagensRecentes.forEach(imgInfo => {
      const img = document.createElement("img");
      img.src = `../data/midia/${imgInfo.img_name}`;
      img.alt = "Projeção IBBV";
      img.style.margin = "10px";
      container.appendChild(img);
    });
  } catch (error) {
    console.error("Erro ao carregar projeção:", error);
    container.textContent = "Erro ao carregar projeção.";
  }
});
