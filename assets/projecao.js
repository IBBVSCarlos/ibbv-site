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

    // Exibe todas as imagens (com zoom 20% e download no tamanho real)
    imagensRecentes.forEach(imgInfo => {
      const link = document.createElement("a");
      link.href = `../data/midia/${imgInfo.img_name}`;
      link.download = imgInfo.img_name;

      const img = document.createElement("img");
      img.src = `../data/midia/${imgInfo.img_name}`;
      img.alt = "Projeção IBBV";
      img.style.margin = "10px";
      img.style.width = "20%"; // Exibe em 20% do tamanho original
      img.style.maxWidth = "250px"; // garante limite
      img.style.borderRadius = "10px";
      img.style.boxShadow = "0 0 10px rgba(255,255,255,0.2)";
      img.style.cursor = "pointer";
      img.style.transition = "transform 0.2s, box-shadow 0.2s";

      img.addEventListener("mouseover", () => {
        img.style.transform = "scale(1.1)";
        img.style.boxShadow = "0 0 20px rgba(255,255,255,0.4)";
      });

      img.addEventListener("mouseout", () => {
        img.style.transform = "scale(1)";
        img.style.boxShadow = "0 0 10px rgba(255,255,255,0.2)";
      });

      link.appendChild(img);
      container.appendChild(link);
    });
  } catch (error) {
    console.error("Erro ao carregar projeção:", error);
    container.textContent = "Erro ao carregar projeção.";
  }
});
