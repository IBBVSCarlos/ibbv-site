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
  }, 3000);
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
  if (btnPix) {
    btnPix.addEventListener("click", () => {
      const pixBox = document.getElementById("pix-box");
      if (pixBox) {
        pixBox.removeAttribute("hidden");
        pixBox.style.display = "block";
      }
    });
  }

  const btnCopiarPix = document.getElementById("btn-copiar-pix");
  if (btnCopiarPix) {
    btnCopiarPix.addEventListener("click", copiarPix);
  }
});
