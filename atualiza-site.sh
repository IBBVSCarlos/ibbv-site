#!/bin/bash

# Entrar na pasta do projeto (se estiver em outro local, ajuste aqui)
cd "$(dirname "$0")"

echo "🔄 Atualizando do GitHub..."
git pull origin main

echo "📦 Adicionando arquivos alterados..."
git add .

echo "📝 Escreva a mensagem do commit:"
read mensagem

git commit -m "$mensagem"

echo "🚀 Enviando para o GitHub..."
git push origin main

echo "✅ Site atualizado com sucesso!"