# Guia de Deploy - Hostinger (Web App Node.js)

Baseado na imagem que você enviou, você tem duas opções principais: **Importar repositório Git** (Recomendado) ou **Faça upload** (Manual).

---

## 🚀 Opção 1: Conectar com GitHub (Recomendada / Automática)

Esta é a melhor opção pois, toda vez que você atualizar o código e enviar para o GitHub, o site atualiza sozinho.

### 1. Preparar o Código
1.  Garanta que seu código está no GitHub.
2.  No seu computador, rode `git push origin main` para enviar as últimas alterações.

### 2. Configurar na Hostinger
1.  Clique no botão **"Conecte-se com GitHub"**.
2.  Autorize a Hostinger a acessar sua conta GitHub.
3.  Escolha o repositório do seu projeto (ex: `aerotech-drone-brasil`).
4.  Selecione a branch `main`.
5.  **Configurações de Build:**
    *   **Diretório Raiz:** `/` (Deixe como está).
    *   **Comando de Build:** `npm install && npm run build`
    *   **Comando de Start:** `npm start`
6.  Clique em **Deploy**.

### 3. Variáveis de Ambiente
Após criar o app, vá nas configurações (Environment Variables) e adicione as mesmas variáveis do seu arquivo `.env`:
*   `DATABASE_URL`
*   `NEXTAUTH_SECRET`
*   `NEXTAUTH_URL`
*   `OPENWEATHER_API_KEY`

---

## 📦 Opção 2: Upload Manual (Como Backup)

Se por algum motivo a conexão com GitHub falhar, você pode usar o método de upload manual.

### 1. Preparar o Arquivo (No seu PC)
1.  Abra o terminal no VS Code.
2.  Rode o comando de build otimizado:
    ```bash
    npm run build
    ```
3.  Vá até a pasta `.next/standalone`.
4.  **Crucial:** Copie a pasta `public` e `.next/static` para dentro dela:
    *   `public` -> `.next/standalone/public`
    *   `.next/static` -> `.next/standalone/.next/static`
5.  Faça um arquivo **ZIP** de tudo que está dentro de `.next/standalone`.

### 2. Subir na Hostinger
1.  Escolha a opção **"Faça upload"**.
2.  Suba o arquivo ZIP.
3.  Configure o **Startup File** como `server.js`.
4.  Configure as variáveis de ambiente.

---

## ❓ Perguntas Comuns

**Qual comando de Start devo usar?**
*   Se usar **GitHub (Opção 1)**, use `npm start`.
*   Se usar **Upload Manual (Opção 2)** com o build standalone, use `node server.js` (ou apenas deixe `server.js` no campo de arquivo de inicialização).

**Erro 500 ao abrir o site?**
Verifique os logs e, principalmente, a variável `DATABASE_URL`. O banco de dados precisa estar acessível pela Hostinger.

---

## 🐙 Como Colocar seu Projeto no GitHub (Passo a Passo)

Como você ainda não tem o Git configurado no seu projeto, siga este guia:

### 1. Criar Repositório no GitHub
1.  Vá em [github.com/new](https://github.com/new).
2.  Coloque o nome `aerotech-drone-brasil`.
3.  Deixe como **Private** (Privado) se não quiser que outros vejam o código.
4.  Clique em **Create repository**.

### 2. Conectar seu Projeto (Pelo VS Code)
1.  Abra o terminal do VS Code (`Ctrl + '`).
2.  Copie e cole estes comandos, um por um (lembre de trocar `SEU-USUARIO`):

```bash
# Iniciar o Git
git init

# Adicionar todos os arquivos
git add .

# Salvar a primeira versão
git commit -m "Primeiro commit - Site Aerotech"

# Criar a branch principal
git branch -M main

# Conectar com o GitHub (SUBSTITUA PELO SEU LINK)
# Pegue o link que o GitHub te deu na página do repositório
git remote add origin https://github.com/SEU-USUARIO/aerotech-drone-brasil.git

# Enviar o código
git push -u origin main
```

> **Atenção:** Na primeira vez que rodar o `git push`, o VS Code vai abrir uma janelinha pedindo permissão para conectar ao GitHub. Clique em **Allow** e autorize no navegador.

### 3. Conectar na Hostinger
1.  Depois de rodar o `git push`, volte no painel da Hostinger.
2.  Selecione a opção **"Conecte-se com GitHub"**.
3.  Quando pedir, selecione o repositório `aerotech-drone-brasil` que você acabou de criar.

Pronto! Agora seu site está conectado. Toda vez que você fizer alterações no futuro:
1.  Faça suas mudanças.
2.  No VS Code, clique no ícone de "Source Control" (o terceiro ícone na barra esquerda).
3.  Escreva uma mensagem (ex: "Atualizei a cor").
4.  Clique em **Commit** e depois em **Sync Changes** (ou Push).
5.  A Hostinger vai atualizar o site sozinha em alguns minutos.
