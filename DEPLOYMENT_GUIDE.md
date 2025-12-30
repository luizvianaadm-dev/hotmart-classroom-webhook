# 🚀 Guia Completo de Deployment

## Hotmart → Google Classroom Webhook

Este guia te leva passo a passo para colocar o webhook em produção.

---

## 📋 Pré-requisitos

- [x] Conta GitHub
- [x] Conta Railway (gratuita em railway.app)
- [x] Conta Hotmart com API ativada
- [x] Google Cloud Project com Classroom API
- [x] Node.js 16+ (para testes locais)

---

## ⏱️ Tempo total estimado: 30 minutos

---

## PASSO 1: Google Cloud Setup (10 min)

### 1.1 Criar Google Cloud Project

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto:
   - Click em "Select a Project" → "NEW PROJECT"
   - Nome: `hotmart-classroom-webhook`
   - Clique em "CREATE"

### 1.2 Ativar Google Classroom API

1. Na barra de busca: procure por "Classroom API"
2. Clique em "Google Classroom API"
3. Clique em "ENABLE"

### 1.3 Criar Service Account

1. Vá para **IAM & Admin** → **Service Accounts**
2. Clique em "CREATE SERVICE ACCOUNT"
   - **Service account name:** `hotmart-webhook`
   - **Service account ID:** Auto-preenchido
   - **Description:** Webhook para matricular alunos no Classroom
   - Clique em "CREATE AND CONTINUE"

3. Na próxima tela (Grant roles):
   - **Select a role:** Procure por "Editor"
   - Selecione **Editor**
   - Clique em "CONTINUE"

4. Na última tela: Clique em "CREATE KEY"
   - **Key type:** JSON
   - Clique em "CREATE"
   - **Um arquivo JSON será baixado** - Guarde em local seguro

### 1.4 Extrair credenciais do JSON

Abra o arquivo JSON baixado e copie:

```json
{
  "type": "service_account",
  "project_id": "seu-projeto-id",
  "private_key_id": "sua-chave-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n",
  "client_email": "hotmart-webhook@seu-projeto.iam.gserviceaccount.com",
  "client_id": "123456789",
  ...
}
```

**Copie:**
- `client_email` → Será usado em GOOGLE_CLIENT_EMAIL
- `private_key` → Será usado em GOOGLE_PRIVATE_KEY (com `\n` literais)

---

## PASSO 2: Google Classroom Setup (5 min)

### 2.1 Adicionar Service Account como Professor

1. Abra sua turma no Google Classroom
2. Clique em **Configurações** (ícone de engrenagem, canto superior direito)
3. Vá para a aba **Professores**
4. Clique em **CONVIDAR PROFESSORES**
5. Cole o `client_email` (ex: `hotmart-webhook@seu-projeto.iam.gserviceaccount.com`)
6. Clique em **CONVIDAR**

### 2.2 Obter ID da Turma

1. No Google Classroom, abra sua turma
2. A URL terá o formato: `classroom.google.com/c/SEU_ID_AQUI`
3. **Copie o ID da turma** → Será usado em CLASSROOM_COURSE_ID

### 2.3 Obter Código de Inscrição (Opcional)

1. Configurações → **Aba Geral**
2. Procure por "Código de classe"
3. Copie o código → Será usado em CLASSROOM_ENROLLMENT_CODE

---

## PASSO 3: Hotmart Webhook Setup (5 min)

### 3.1 Configurar Webhook no Hotmart

1. Acesse sua conta Hotmart
2. Vá para **Meus Produtos** → Selecione o produto/turma
3. Clique em **API e Webhooks**
4. Clique em **Novo Webhook**

### 3.2 Preencher dados do Webhook

Por enquanto, vamos colocar uma URL placeholder (atualizaremos após deploy no Railway):

- **URL do Webhook:** `https://seu-dominio-temporario.railway.app/webhook/hotmart`
- **Eventos a notificar:**
  - ✅ `purchase.approved` (compra aprovada)
  - ✅ `purchase.refunded` (reembolso)
- Clique em **SALVAR**

### 3.3 Copiar Secret

1. No webhook criado, clique em **Editar**
2. Procure por "Secret" ou "API Key"
3. **Copie o valor** → Será usado em HOTMART_WEBHOOK_SECRET
4. Não feche essa página ainda!

---

## PASSO 4: Deploy no Railway (8 min)

### 4.1 Conectar GitHub ao Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em **Login** → Autentique com GitHub
3. Após autenticar, clique em **New Project**
4. Selecione **Deploy from GitHub repo**
5. Autorize Railway a acessar seus repositórios
6. Procure por `hotmart-classroom-webhook`
7. Clique em **Import**

### 4.2 Configurar Variáveis de Ambiente

1. Railway abrirá o projeto automaticamente
2. Clique na **aba "Variables"**
3. Clique em **New Variable**
4. Adicione as seguintes variáveis:

```env
HOTMART_WEBHOOK_SECRET=seu_secret_copiado_da_hotmart
CLASSROOM_COURSE_ID=id_da_sua_turma
CLASSROOM_ENROLLMENT_CODE=codigo_inscricao_opcional
GOOGLE_CLIENT_EMAIL=hotmart-webhook@seu-projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n"
PORT=3000
NODE_ENV=production
```

⚠️ **Importante:** A `GOOGLE_PRIVATE_KEY` deve ter `\n` literais (dois caracteres) entre as linhas, não quebras de linha reais.

### 4.3 Deploy Automático

1. Clique em **Deploy**
2. Railway fará o build e deploy automaticamente
3. Aguarde até ver "✓ Build Successful"
4. Clique em **View Logs** para monitorar

### 4.4 Obter URL do Deploy

1. Clique na aba **Settings**
2. Procure por "Domain"
3. Copie a URL gerada (ex: `https://hotmart-classroom-webhook-production.up.railway.app`)

---

## PASSO 5: Atualizar Webhook na Hotmart (2 min)

1. Volte ao painel Hotmart → API e Webhooks
2. Edite o webhook criado anteriormente
3. Atualize a URL:
   ```
   https://sua-url-railway.up.railway.app/webhook/hotmart
   ```
4. Clique em **SALVAR**

---

## ✅ Testar Webhook

### 5.1 Teste de Saúde

```bash
curl https://sua-url-railway.up.railway.app/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T14:30:00.000Z"
}
```

### 5.2 Teste com Hotmart (Produção)

1. Faça uma compra de teste na Hotmart (ou use a função de "enviar webhook de teste" se disponível)
2. Verifique no Railway → Logs se a requisição chegou
3. Verifique no Google Classroom se o aluno foi matriculado

---

## 🔍 Monitoramento e Logs

### Ver Logs em Tempo Real

```bash
railway logs --follow
```

### Ver Logs no Dashboard Railway

1. Acesse [railway.app](https://railway.app) → Seu projeto
2. Aba **Logs**
3. Veja eventos em tempo real

### Logs esperados em caso de sucesso:

```
✅ Aluno seu-email@example.com matriculado com sucesso
📧 Processando compra de: seu-email@example.com
🚀 Webhook server rodando em porta 3000
```

---

## ❌ Troubleshooting

### Erro: "Invalid signature"

**Causa:** HOTMART_WEBHOOK_SECRET incorreto

**Solução:**
1. Vá para Hotmart → API e Webhooks
2. Copie novamente o Secret
3. Atualize no Railway
4. Redeploy

### Erro: "Aluno já está matriculado"

**Isto NÃO é um erro!** O webhook retorna código 409 (conflict), que significa que o aluno já foi matriculado anteriormente. Sistema está funcionando corretamente.

### Erro: "Invalid JWT Token"

**Causa:** GOOGLE_PRIVATE_KEY malformada

**Solução:**
1. Verifique se o valor começa com `-----BEGIN PRIVATE KEY-----`
2. Verifique se contém `\n` literais (dois caracteres)
3. Verifique se termina com `-----END PRIVATE KEY-----\n`

Exemplo correto:
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2...\n-----END PRIVATE KEY-----\n
```

### Erro: "Service Account not found as teacher"

**Causa:** Service Account não foi adicionado como professor

**Solução:**
1. Classroom → Configurações → Professores
2. Convide novamente o `client_email`
3. Aguarde 2-3 minutos

---

## 📊 Métricas de Performance

Apos deploy, você deve ter:

- **Resposta do webhook:** < 100ms
- **Matrícula completa:** 2-5 segundos
- **Uptime:** 99.9% (SLA Railway)
- **Custo:** Gratuito para primeiros 500 horas/mês

---

## 🎉 Pronto!

Seu webhook automático está vivo! Agora:

✅ Clientes compram na Hotmart
✅ Hotmart envia evento de compra
✅ Railway recebe e valida
✅ Google Classroom matricula aluno automaticamente

**Tempo para primeira matrícula: ~3 segundos após pagamento aprovado**

---

## 📞 Suporte

Dúvidas? Verifique:

1. [README.md](./README.md) - Documentação técnica
2. [GitHub Issues](https://github.com/luizvianaadm-dev/hotmart-classroom-webhook/issues) - Problemas conhecidos
3. Logs do Railway - Mensagens de erro detalhadas

---

**Atualizado:** 30 de dezembro de 2025
**Versão:** 1.0.0
**Status:** ✅ Pronto para Produção
