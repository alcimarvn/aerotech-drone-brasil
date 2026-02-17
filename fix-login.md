# 🔧 Guia Rápido de Correção do Login

## Problema
Não consegue fazer login no sistema admin mesmo com credenciais corretas.

## Diagnóstico Completo
Veja o relatório detalhado em: `diagnostico-autenticacao.md`

## ⚡ Correção Rápida (Faça Agora)

### Passo 1: Teste Manual
1. Certifique-se de que o servidor está rodando: `npm run dev`
2. Abra o navegador em: http://localhost:3000/login
3. Abra o Console (F12 → Console)
4. Abra a aba Network (F12 → Network)
5. Tente fazer login com:
   - Email: `admin@aerotech.com.br`
   - Senha: `admin123`
6. **Anote qualquer erro** que aparecer no console ou na aba Network

### Passo 2: Adicionar Logs Detalhados

Edite o arquivo `src/components/auth/login-form.tsx` e modifique a linha 48:

**ANTES:**
```typescript
if (result?.error) {
    setError("E-mail ou senha incorretos. Tente novamente.")
    return
}
```

**DEPOIS:**
```typescript
if (result?.error) {
    console.error('❌ Erro de login:', result.error)
    console.error('❌ Detalhes completos:', result)
    setError(`Erro de autenticação: ${result.error}`)
    return
}
```

### Passo 3: Adicionar Logs no Backend

Edite o arquivo `src/lib/auth.ts` e adicione logs no callback `authorize` (após a linha 23):

```typescript
async authorize(credentials) {
    try {
        console.log('🔐 Tentativa de login:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
            console.error('❌ Credenciais ausentes')
            return null
        }

        const user = await db.user.findUnique({
            where: { email: credentials.email }
        })

        if (!user) {
            console.error('❌ Usuário não encontrado:', credentials.email)
            return null
        }

        console.log('✅ Usuário encontrado:', user.email)

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
            console.error('❌ Senha inválida para:', credentials.email)
            return null
        }

        console.log('✅ Senha válida! Login bem-sucedido para:', user.email)

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        }
    } catch (error) {
        console.error('❌ Erro crítico no authorize:', error)
        return null
    }
}
```

### Passo 4: Reiniciar o Servidor

1. Pare o servidor (Ctrl+C no terminal)
2. Inicie novamente: `npm run dev`
3. Tente fazer login novamente
4. **Observe os logs no terminal** onde o servidor está rodando

## 🔍 O Que Procurar

### No Console do Navegador (F12):
- Erros JavaScript em vermelho
- Mensagens de erro do NextAuth
- Problemas de CORS ou rede

### No Terminal do Servidor:
- Mensagens com ❌ indicando onde o erro ocorreu
- Se vir "✅ Senha válida!" mas o login falhar, o problema está no callback/redirecionamento
- Se vir "❌ Usuário não encontrado", o problema está no banco de dados

### Na Aba Network (F12):
- Procure pela requisição para `/api/auth/callback/credentials`
- Verifique o Status Code (deve ser 200 ou 302)
- Clique na requisição e veja a resposta (Response tab)

## 🆘 Se Ainda Não Funcionar

Execute estes comandos para resetar tudo:

```bash
# 1. Resetar o banco de dados
npx prisma db push --force-reset

# 2. Recriar o usuário admin
npm run prisma:seed

# 3. Limpar cache do Next.js
rm -rf .next

# 4. Reinstalar dependências
npm install

# 5. Reiniciar o servidor
npm run dev
```

## 📞 Informações para Suporte

Se precisar de ajuda, forneça:
1. Mensagens de erro do console do navegador
2. Logs do terminal do servidor
3. Status code da requisição `/api/auth/callback/credentials`
4. Screenshot da aba Network mostrando a requisição de login
