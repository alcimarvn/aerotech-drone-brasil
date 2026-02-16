# 🚀 Como Configurar o Banco de Dados na Hostinger

## ✅ O QUE JÁ ESTÁ PRONTO

- ✅ Código está no GitHub
- ✅ Todos os erros de TypeScript foram corrigidos
- ✅ O build vai funcionar ASSIM QUE você configurar o banco de dados

---

## ⚠️ O QUE FALTA FAZER (APENAS 3 PASSOS)

### PASSO 1: Encontrar as Informações do Banco de Dados

1. No painel da Hostinger, procure por **"Bancos de Dados"** ou **"MySQL Databases"**
2. Você vai ver algo assim:
   - **Nome do Banco:** `u616633601_aerotech` (exemplo)
   - **Usuário:** `u616633601_admin` (exemplo)
   - **Senha:** `SuaSenha123` (a que você criou)
   - **Host:** `localhost` ou `127.0.0.1`
   - **Porta:** `3306`

3. **ANOTE ESSAS INFORMAÇÕES** (você vai precisar no próximo passo)

---

### PASSO 2: Configurar as Variáveis de Ambiente

1. No painel da Hostinger, vá na sua aplicação Node.js
2. Procure por **"Environment Variables"** ou **"Variáveis de Ambiente"**
3. Clique em **"Add Variable"** ou **"+ Nova Variável"**

4. **Adicione estas 3 variáveis:**

#### Variável 1: DATABASE_URL
```
Nome: DATABASE_URL
Valor: mysql://USUARIO:SENHA@localhost:3306/NOME_DO_BANCO
```

**Exemplo real:**
```
mysql://u616633601_admin:SuaSenha123@localhost:3306/u616633601_aerotech
```

**⚠️ IMPORTANTE:** Substitua:
- `USUARIO` pelo usuário do banco que você anotou
- `SENHA` pela senha do banco
- `NOME_DO_BANCO` pelo nome do banco que você anotou

#### Variável 2: NEXTAUTH_URL
```
Nome: NEXTAUTH_URL
Valor: https://aerotechdrones.com.br
```

#### Variável 3: NEXTAUTH_SECRET
```
Nome: NEXTAUTH_SECRET
Valor: qualquer-texto-aleatorio-bem-longo-e-seguro-12345
```

5. Clique em **"Save"** ou **"Salvar"**

---

### PASSO 3: Fazer o Deploy

1. Depois de salvar as variáveis, procure por **"Redeploy"** ou **"Deploy Again"**
2. Clique nesse botão
3. Aguarde o build terminar (pode levar 2-3 minutos)
4. **PRONTO!** ✅ Seu site deve estar funcionando!

---

## 🆘 SE DER ERRO

**Se aparecer erro de "DATABASE_URL not found":**
- Verifique se você salvou as variáveis corretamente
- Verifique se o nome está exatamente `DATABASE_URL` (tudo maiúsculo)

**Se aparecer erro de conexão com banco:**
- Verifique se o usuário e senha estão corretos
- Verifique se o nome do banco está correto
- Tente trocar `localhost` por `127.0.0.1` na URL

---

## 📸 ONDE ENCONTRAR CADA COISA

### Bancos de Dados:
```
Painel Hostinger → Menu Lateral → "Databases" ou "Bancos de Dados"
```

### Variáveis de Ambiente:
```
Painel Hostinger → Sua Aplicação Node.js → "Environment Variables"
```

### Redeploy:
```
Painel Hostinger → Sua Aplicação Node.js → Botão "Redeploy" ou "Deploy Again"
```

---

## ✅ CHECKLIST RÁPIDO

- [ ] Anotei as informações do banco de dados (usuário, senha, nome)
- [ ] Adicionei a variável `DATABASE_URL` com a URL correta
- [ ] Adicionei a variável `NEXTAUTH_URL` com o domínio do site
- [ ] Adicionei a variável `NEXTAUTH_SECRET` com um texto aleatório
- [ ] Cliquei em "Save" para salvar as variáveis
- [ ] Cliquei em "Redeploy" para fazer o deploy novamente
- [ ] Aguardei o build terminar

**Quando todos os itens estiverem marcados, seu site estará no ar!** 🎉
