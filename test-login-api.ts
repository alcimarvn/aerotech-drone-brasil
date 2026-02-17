/**
 * Script para testar a autenticação via API
 * Simula o que o formulário de login faz
 */

async function testLogin() {
    console.log('🧪 Testando autenticação via API...\n')

    const credentials = {
        email: 'admin@aerotech.com.br',
        password: 'admin123'
    }

    try {
        console.log('📤 Enviando requisição de login...')
        console.log(`   Email: ${credentials.email}`)
        console.log(`   Senha: ${credentials.password}\n`)

        // Testar o endpoint de autenticação
        const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                email: credentials.email,
                password: credentials.password,
                callbackUrl: 'http://localhost:3000/dashboard',
                json: 'true'
            })
        })

        console.log(`📥 Status da resposta: ${response.status} ${response.statusText}`)

        const contentType = response.headers.get('content-type')
        console.log(`   Content-Type: ${contentType}\n`)

        if (contentType?.includes('application/json')) {
            const data = await response.json()
            console.log('📋 Resposta JSON:')
            console.log(JSON.stringify(data, null, 2))
            console.log('')

            if (data.url) {
                console.log('✅ Login bem-sucedido! Redirecionamento para:', data.url)
            } else if (data.error) {
                console.log('❌ Erro no login:', data.error)
            }
        } else {
            const text = await response.text()
            console.log('📋 Resposta (texto):')
            console.log(text.substring(0, 500))
            console.log('')
        }

        // Testar também o endpoint de signin
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('🧪 Testando endpoint alternativo...\n')

        const signInResponse = await fetch('http://localhost:3000/api/auth/signin', {
            method: 'GET',
        })

        console.log(`📥 Status: ${signInResponse.status} ${signInResponse.statusText}`)

        if (signInResponse.ok) {
            console.log('✅ Endpoint /api/auth/signin está acessível')
        } else {
            console.log('❌ Problema ao acessar /api/auth/signin')
        }

        // Testar o endpoint de providers
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('🧪 Testando configuração de providers...\n')

        const providersResponse = await fetch('http://localhost:3000/api/auth/providers', {
            method: 'GET',
        })

        if (providersResponse.ok) {
            const providers = await providersResponse.json()
            console.log('✅ Providers configurados:')
            console.log(JSON.stringify(providers, null, 2))
        } else {
            console.log('❌ Erro ao buscar providers')
        }

    } catch (error) {
        console.error('\n❌ ERRO ao testar autenticação:', error)

        if (error instanceof Error) {
            console.log(`   Mensagem: ${error.message}`)
            console.log(`   Stack: ${error.stack}`)
        }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 CONCLUSÃO DO TESTE')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('💡 Se você viu "Login bem-sucedido", o backend está funcionando.')
    console.log('💡 Se houve erro, verifique os logs acima para detalhes.\n')
}

// Aguardar um pouco para garantir que o servidor está pronto
setTimeout(testLogin, 2000)
