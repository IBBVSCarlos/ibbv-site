// =====================================
// 💳 PIX - Copiar Chave & Mostrar Confirmação
// =====================================

function mostrarMensagemCopiada(chave, igreja, banco) {
  const msgBox = document.getElementById("msg-copiado");
  if (!msgBox) return;

  msgBox.innerHTML = `
    <strong>Chave copiada:</strong><br>
    ${chave}<br>
    ${igreja}<br>
    ${banco}
  `;

  msgBox.classList.add("show");
  setTimeout(() => {
    msgBox.classList.remove("show");
  }, 5000);
}

function copiarPix() {
  const pixElemento = document.getElementById("pix");
  if (pixElemento) {
    const chave = pixElemento.textContent.trim();
    navigator.clipboard.writeText(chave).then(() => {
      mostrarMensagemCopiada(
        chave,
        "Igreja Batista de Boa Vista",
        "CCM SICOOB CREDIACISC"
      );
    }).catch(() => {
      alert("Erro ao copiar a chave PIX.");
    });
  } else {
    alert("Chave PIX não encontrada.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btnPix = document.getElementById("btn-pix");
  const pixBox = document.getElementById("pix-box");

  if (btnPix && pixBox) {
    btnPix.addEventListener("click", () => {
      const aberto = pixBox.classList.contains("visible");

      if (aberto) {
        pixBox.classList.remove("visible", "fade-in");
        pixBox.classList.add("fade-out");
        btnPix.textContent = "💳 Dízimos e Ofertas";
      } else {
        pixBox.classList.remove("fade-out");
        pixBox.classList.add("visible", "fade-in");
        btnPix.textContent = "❌ Fechar chave PIX";
      }
    });
  }

  const btnCopiarPix = document.getElementById("btn-copiar-pix");
  if (btnCopiarPix) {
    btnCopiarPix.addEventListener("click", copiarPix);
  }
});
