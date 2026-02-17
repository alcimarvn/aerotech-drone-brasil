async function checkEnv() {
    console.log('🔍 Checando variáveis de ambiente via API...\n')
    try {
        const response = await fetch('http://localhost:3000/api/debug-env')
        if (response.ok) {
            const data = await response.json()
            console.log('📋 Variáveis de Ambiente no Servidor:')
            console.log(JSON.stringify(data, null, 2))
        } else {
            console.log(`❌ Erro ao acessar rota de debug: ${response.status} ${response.statusText}`)
            const text = await response.text()
            console.log('Resposta:', text)
        }
    } catch (error) {
        console.error('❌ Erro de conexão:', error)
    }
}

checkEnv()
