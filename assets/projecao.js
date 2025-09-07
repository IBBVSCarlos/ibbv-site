document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("container");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const btnPrev = document.getElementById("prev");
  const btnNext = document.getElementById("next");
  const btnDownload = document.getElementById("download");
  const btnClose = document.getElementById("close");

  let imagensRecentes = [];
  let currentIndex = 0;

  try {
    const res = await fetch("../data/projecao.json");
    const dados = await res.json();

    if (!dados || dados.length === 0) {
      container.textContent = "Nenhuma projeção encontrada.";
      return;
    }

    const datas = dados.map(item => new Date(item.dt_inclusao));
    const maxData = new Date(Math.max.apply(null, datas));

    imagensRecentes = dados.filter(
      item => new Date(item.dt_inclusao).getTime() === maxData.getTime()
    );

    container.innerHTML = "";

    imagensRecentes.forEach((imgInfo, index) => {
      const img = document.createElement("img");
      img.src = `../data/midia/${imgInfo.img_name}`;
      img.alt = "Projeção IBBV";
      img.addEventListener("click", () => openLightbox(index));
      container.appendChild(img);
    });

  } catch (error) {
    console.error("Erro ao carregar projeção:", error);
    container.textContent = "Erro ao carregar projeção.";
  }

  // --- Lightbox ---
  function openLightbox(index) {
    currentIndex = index;
    lbImg.src = `../data/midia/${imagensRecentes[currentIndex].img_name}`;
    lbImg.alt = `Projeção IBBV - ${imagensRecentes[currentIndex].dt_inclusao}`;
    lightbox.style.display = "flex";
  }

  function closeLightbox() {
    lightbox.style.display = "none";
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % imagensRecentes.length;
    lbImg.src = `../data/midia/${imagensRecentes[currentIndex].img_name}`;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + imagensRecentes.length) % imagensRecentes.length;
    lbImg.src = `../data/midia/${imagensRecentes[currentIndex].img_name}`;
  }

  function downloadImage() {
    const link = document.createElement("a");
    link.href = `../data/midia/${imagensRecentes[currentIndex].img_name}`;
    link.download = imagensRecentes[currentIndex].img_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- Eventos dos botões ---
  btnClose.addEventListener("click", closeLightbox);
  btnNext.addEventListener("click", showNext);
  btnPrev.addEventListener("click", showPrev);
  btnDownload.addEventListener("click", downloadImage);

  // --- Fechar clicando fora da imagem ---
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });

  // --- Teclas de atalho ---
  document.addEventListener("keydown", e => {
    if (lightbox.style.display === "flex") {
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "Escape") closeLightbox();
    }
  });

  // --- Swipe touch ---
  let touchStartX = 0;
  let touchEndX = 0;

  lbImg.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  lbImg.addEventListener("touchend", e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  });

  function handleSwipeGesture() {
    const threshold = 50; // pixels mínimo para considerar swipe
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        showNext(); // swipe para esquerda
      } else {
        showPrev(); // swipe para direita
      }
    }
  }
});
