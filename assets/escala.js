// =====================================
// 🛐 Escala de Ministérios (com modais)
// =====================================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch('data/escalamin.json');
    const escala = await res.json();

    // IDs dos modais correspondentes aos ministérios
    const ministerios = {
      "Recepção": "modal-recepcao",
      "Culto Kids": "modal-kids",
      "Cantina": "modal-cantina",
      "Culto de Quarta-Feira": "modal-quarta"
    };

    // Cria os modais dinamicamente
    Object.entries(ministerios).forEach(([nome, id]) => {
      const modal = document.createElement("div");
      modal.className = "modal-escala";
      modal.id = id;

      const ministerioData = escala.find(m => m.ministerio === nome);
      const escalados = ministerioData ? ministerioData.escalados : [];

      modal.innerHTML = `
        <div class="modal-escala-content">
          <button class="modal-close" onclick="document.getElementById('${id}').classList.remove('active')">×</button>
          <h3>${nome}</h3>
          <ul>
            ${escalados.map(({ dia, nome }) => `<li><strong>${dia}:</strong> ${nome}</li>`).join('')}
          </ul>
        </div>
      `;
      document.body.appendChild(modal);
    });

    // Adiciona eventos de clique para abrir modais
    document.querySelectorAll(".escala-item").forEach(item => {
      item.addEventListener("click", () => {
        const modalId = item.dataset.modal;
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add("active");
      });
    });

  } catch (error) {
    console.error("Erro ao carregar escala de ministérios:", error);
    const fallback = document.getElementById("lista-escala");
    if (fallback) {
      fallback.innerHTML = '<li>Erro ao carregar escala.</li>';
    }
  }
});
