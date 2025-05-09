# Boletim IBBV São Carlos

Este repositório contém o Boletim Informativo da Igreja Batista de Boa Vista - São Carlos (IBBV São Carlos).

---

## ✅ Conteúdo

- `index.html`: Página HTML do boletim
- `logo_site.png`: Logotipo da igreja (usado no cabeçalho e como marca d'água)
- `modelo_boletim.csv`: Modelo de planilha para integração automática

---

## 🌐 Como publicar no GitHub Pages

### 1. Crie um repositório no GitHub
Acesse: [https://github.com/new](https://github.com/new)

- Nome sugerido: `boletim-ibbv`
- Marque como **público**
- **Não** adicione README ou `.gitignore`

### 2. Envie os arquivos

Abra o terminal ou Git Bash na pasta onde extraiu os arquivos e execute:

```bash
git init
git remote add origin https://github.com/SEU-USUARIO/boletim-ibbv.git
git add .
git commit -m "Publicação inicial do boletim"
git push -u origin master
```

> Substitua `SEU-USUARIO` pelo seu nome de usuário no GitHub.

### 3. Ative o GitHub Pages

- Vá até o repositório no GitHub
- Clique em **Settings > Pages**
- Em **Source**, escolha:
  - **Branch:** `master`
  - **Folder:** `/ (root)`
- Clique em **Save**

### 4. Acesse seu boletim

Após alguns segundos, o boletim estará disponível em:

```
https://SEU-USUARIO.github.io/boletim-ibbv/
```

---

## 📝 Como usar a planilha

Edite sua planilha Google com as seguintes colunas na primeira linha:

- `mensagem`
- `programacao` (itens separados por `;`)
- `oracao`
- `versiculo`
- `aniversariantes` (Ex: João - 05/05; Maria - 07/05)
- `escala` (Ex: Louvor: Equipe A; Limpeza: Equipe B)
- `avisos` (separados por `;`)

Depois clique em **Arquivo > Compartilhar > Publicar na Web**  
E use o link CSV gerado para substituir no `index.html` em:
```javascript
const sheetURL = 'SEU-LINK-CSV-AQUI';
```

---

## ✉️ Contato

**IBBV São Carlos**  
Av Henrique Gregory, 151 - São Carlos/SP  
📞 (16) 99205-3530  
📧 ibbvsaocarlos@gmail.com