# hotmart-classroom-webhook
Webhook automático para matricular alunos do Hotmart na turma do Google Classroom. Integração em tempo real entre Hotmart e Classroom com Railway + Vercel.

## Funcionalidades

- ✅ Webhook automático para receber eventos de compra da Hotmart
- ✅ Verificação de assinatura (HMAC-SHA256) para segurança
- ✅ Matrícula automática em tempo real no Google Classroom
- ✅ Suporte para JWT (Service Account) do Google Cloud
- ✅ Tratamento de erros e logs detalhados
- ✅ Health check endpoint para monitoramento
- ✅ Pronto para deploy em Railway/Heroku

## Pré-requisitos

1. **Node.js** 16+ instalado
2. **Conta Hotmart** com API ativada
3. **Google Cloud Project** com:
   - Google Classroom API ativada
   - Service Account criada com permissões de professor
   - JSON da chave privada da Service Account
4. **ID do Curso do Google Classroom**
5. **Código de inscrição da turma** (opcional)

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/luizvianaadm-dev/hotmart-classroom-webhook.git
cd hotmart-classroom-webhook
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` com suas configurações:

```env
HOTMART_WEBHOOK_SECRET=seu_secret_hotmart
CLASSROOM_COURSE_ID=NzkyOTc4OTMwMzYw
CLASSROOM_ENROLLMENT_CODE=
GOOGLE_CLIENT_EMAIL=sua-sa@seu-projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key_Here\n-----END PRIVATE KEY-----\n"
PORT=3000
NODE_ENV=production
```

### 4. Compilar TypeScript

```bash
npm run build
```

### 5. Iniciar servidor

```bash
npm start
```

Ou em desenvolvimento:

```bash
npm run dev
```

## Deploy no Railway

### 1. Conectar ao GitHub

1. Acesse [railway.app](https://railway.app)
2. Click em "Deploy a new project"
3. Selecione este repositório GitHub

### 2. Configurar variáveis de ambiente

No painel do Railway, adicione as env vars conforme `.env.example`

### 3. Deploy automático

Railway fará o deploy automaticamente a cada push para a branch `main`

## Configuração do Webhook no Hotmart

1. Acesse sua conta Hotmart → Seu Produto
2. Vá para **API e Webhooks**
3. Crie um novo webhook com:
   - **URL:** `https://seu-domain.railway.app/webhook/hotmart`
   - **Eventos:** `purchase.approved`, `purchase.refunded`
   - **Secret:** Copie o valor gerado e salve em `HOTMART_WEBHOOK_SECRET`

## Obter credenciais Google Cloud

### Criar Service Account

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google Classroom API**
4. Crie uma **Service Account**:
   - IAM & Admin → Service Accounts → Create Service Account
   - Dê acesso à API do Classroom como **Editor**
5. Crie uma chave JSON:
   - Selecione a Service Account
   - Aba "Keys" → Criar chave JSON
   - Faça download do arquivo JSON
6. Copie os valores:
   - `client_email` → `GOOGLE_CLIENT_EMAIL`
   - `private_key` → `GOOGLE_PRIVATE_KEY`

### Adicionar Service Account ao Google Classroom

1. Acesse sua turma no Google Classroom
2. Configurações → "Adicionar professores"
3. Cole o `client_email` da Service Account
4. Aguarde aceitar o convite (ou acesse o link no e-mail)

## Endpoints

### POST /webhook/hotmart

Recebe eventos do Hotmart e matricula alunos automaticamente.

**Request (via Hotmart):**
```json
{
  "event": "PURCHASE_APPROVED",
  "status": "approved",
  "buyer": {
    "email": "aluno@example.com",
    "name": "João Silva"
  },
  "id": "transacao_12345"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Aluno aluno@example.com matriculado com sucesso"
}
```

### GET /health

Verifica se o servidor está online.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T14:30:00.000Z"
}
```

## Troubleshooting

### Erro "Invalid signature"

- Verifique se `HOTMART_WEBHOOK_SECRET` está correto
- Certifique-se de que corresponde ao secret gerado na Hotmart

### Erro de autenticação Google

- Confirme que a Service Account foi adicionada como professor na turma
- Verifique se `GOOGLE_PRIVATE_KEY` está formatado corretamente (com `\n` literais)

### Aluno não matriculado

- Verifique logs do Railway: `railway logs`
- Confirme que o e-mail do aluno é válido
- Verifique permissões da Service Account

## Logs

Verifique logs em tempo real no Railway:

```bash
railway logs --follow
```

## Licença

MIT © VORCON

## Suporte

Para dúvidas ou issues: [GitHub Issues](https://github.com/luizvianaadm-dev/hotmart-classroom-webhook/issues)
