
document.addEventListener("DOMContentLoaded", () => {
    fetch("dados.json")
        .then(response => response.json())
        .then(data => {
            const versiculo = data.versiculo;
            const aniversariantes = data.aniversariantes;
            const escala = data.escala;

            document.getElementById("versiculo").innerHTML = `
                <h3>Versículo da Semana</h3>
                <p><strong>${versiculo.texto}</strong></p>
                <p>${versiculo.referencia}</p>
            `;

            document.getElementById("aniversariantes").innerHTML = `
                <h3>Aniversariantes da Semana</h3>
                <ul>
                    ${aniversariantes.map(a => `<li>${a.nome} - ${a.data}</li>`).join("")}
                </ul>
            `;

            document.getElementById("escala").innerHTML = `
                <h3>Escala de Ministérios</h3>
                ${escala.map(e => `
                    <p><strong>${e.data}</strong>: ${e.ministerio} - ${e.responsavel}</p>
                `).join("")}
            `;
        })
        .catch(error => console.error("Erro ao carregar dados:", error));
});
