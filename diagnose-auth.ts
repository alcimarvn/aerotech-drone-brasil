import { PrismaClient } from '@prisma/client'
import { compare, hash } from 'bcrypt'

const prisma = new PrismaClient()

async function diagnoseAuth() {
    console.log('🔍 Iniciando diagnóstico de autenticação...\n')

    try {
        // 1. Verificar conexão com o banco
        console.log('1️⃣ Testando conexão com o banco de dados...')
        await prisma.$connect()
        console.log('✅ Conexão com o banco estabelecida com sucesso!\n')

        // 2. Listar todos os usuários
        console.log('2️⃣ Listando usuários cadastrados:')
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            }
        })

        if (users.length === 0) {
            console.log('❌ PROBLEMA: Nenhum usuário encontrado no banco de dados!')
            console.log('   Solução: Execute o comando "npm run prisma:seed" para criar o usuário admin.\n')
        } else {
            console.log(`✅ Encontrados ${users.length} usuário(s):\n`)
            users.forEach((user, index) => {
                console.log(`   ${index + 1}. Email: ${user.email}`)
                console.log(`      Nome: ${user.name}`)
                console.log(`      Role: ${user.role}`)
                console.log(`      Criado em: ${user.createdAt}`)
                console.log('')
            })
        }

        // 3. Verificar usuário admin específico
        console.log('3️⃣ Verificando usuário admin padrão (admin@aerotech.com.br)...')
        const adminUser = await prisma.user.findUnique({
            where: { email: 'admin@aerotech.com.br' }
        })

        if (!adminUser) {
            console.log('❌ PROBLEMA: Usuário admin@aerotech.com.br não encontrado!')
            console.log('   Solução: Execute o comando "npm run prisma:seed" para criar o usuário admin.\n')
        } else {
            console.log('✅ Usuário admin encontrado!')
            console.log(`   ID: ${adminUser.id}`)
            console.log(`   Nome: ${adminUser.name}`)
            console.log(`   Role: ${adminUser.role}\n`)

            // 4. Testar senha
            console.log('4️⃣ Testando senha padrão (admin123)...')
            const isPasswordValid = await compare('admin123', adminUser.password)

            if (isPasswordValid) {
                console.log('✅ Senha "admin123" está CORRETA!\n')
            } else {
                console.log('❌ PROBLEMA: Senha "admin123" está INCORRETA!')
                console.log('   A senha no banco não corresponde à senha padrão.')
                console.log('   Solução: Execute o comando "npm run prisma:seed" para resetar a senha.\n')

                // Mostrar hash da senha atual (para debug)
                console.log(`   Hash atual no banco: ${adminUser.password.substring(0, 20)}...\n`)
            }
        }

        // 5. Verificar variáveis de ambiente
        console.log('5️⃣ Verificando variáveis de ambiente...')
        const envVars = {
            DATABASE_URL: process.env.DATABASE_URL ? '✅ Configurada' : '❌ NÃO configurada',
            NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Configurada' : '❌ NÃO configurada',
            NEXTAUTH_URL: process.env.NEXTAUTH_URL ? '✅ Configurada' : '❌ NÃO configurada',
        }

        Object.entries(envVars).forEach(([key, status]) => {
            console.log(`   ${key}: ${status}`)
        })
        console.log('')

        // 6. Testar hash de senha (criar novo hash para comparação)
        console.log('6️⃣ Testando geração de hash bcrypt...')
        const testPassword = 'admin123'
        const newHash = await hash(testPassword, 12)
        const testCompare = await compare(testPassword, newHash)

        if (testCompare) {
            console.log('✅ Biblioteca bcrypt funcionando corretamente!\n')
        } else {
            console.log('❌ PROBLEMA: Erro na biblioteca bcrypt!\n')
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('📋 RESUMO DO DIAGNÓSTICO')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

        if (users.length === 0) {
            console.log('🔴 AÇÃO NECESSÁRIA: Execute "npm run prisma:seed" para criar usuários.')
        } else if (!adminUser) {
            console.log('🔴 AÇÃO NECESSÁRIA: Execute "npm run prisma:seed" para criar o usuário admin.')
        } else if (!(await compare('admin123', adminUser.password))) {
            console.log('🔴 AÇÃO NECESSÁRIA: Execute "npm run prisma:seed" para resetar a senha do admin.')
        } else {
            console.log('🟢 TUDO OK! O sistema de autenticação está configurado corretamente.')
            console.log('\n📌 Credenciais de acesso:')
            console.log('   Email: admin@aerotech.com.br')
            console.log('   Senha: admin123')
            console.log('   URL: http://localhost:3000/login')
        }

    } catch (error) {
        console.error('\n❌ ERRO CRÍTICO:', error)

        if (error instanceof Error) {
            if (error.message.includes('connect')) {
                console.log('\n💡 Dica: Verifique se o MySQL está rodando e se as credenciais no .env estão corretas.')
            }
        }
    } finally {
        await prisma.$disconnect()
    }
}

diagnoseAuth()
