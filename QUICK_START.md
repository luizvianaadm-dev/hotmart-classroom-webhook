# ⚡ Quick Start - 5 Minutos

> **Para deployment completo com tudo explicado, leia [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

---

## RESUMO

**Hotmart → Google Classroom (Automático)**

1. Cliente compra na Hotmart
2. Hotmart envia webhook
3. Webhook valida assinatura
4. Aluno é matriculado no Classroom
⏱️ **Tempo total: ~3 segundos**

---

## PRÉ-REQUISITOS

```
✅ Conta GitHub
✅ Conta Railway (gratuita)
✅ Conta Hotmart com API
✅ Google Cloud Project
✅ Google Classroom turma criada
```

---

## 5 PASSOS RÁPIDOS

### 1️⃣ GOOGLE CLOUD (2 min)

```bash
1. console.cloud.google.com
2. New Project → "hotmart-classroom-webhook"
3. Ativar "Google Classroom API"
4. IAM & Admin → Service Accounts → Create
5. Nome: hotmart-webhook
6. Grant: Editor
7. Create Key → JSON (Download)
8. Copie client_email e private_key
```

### 2️⃣ GOOGLE CLASSROOM (1 min)

```bash
1. Sua turma → Configurações → Professores
2. Convidar: cole o client_email
3. Copie ID da turma da URL: classroom.google.com/c/{ID}
```

### 3️⃣ HOTMART WEBHOOK (1 min)

```bash
1. Seu Produto → API e Webhooks → Novo Webhook
2. Eventos: purchase.approved, purchase.refunded
3. Copie o Secret gerado
```

### 4️⃣ DEPLOY RAILWAY (1 min)

```bash
1. railway.app → New Project
2. Deploy from GitHub
3. Selecione: hotmart-classroom-webhook
4. Variables → Adicione:
```

```env
HOTMART_WEBHOOK_SECRET=seu_secret
CLASSROOM_COURSE_ID=id_turma
GOOGLE_CLIENT_EMAIL=seu_sa@seu-projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
PORT=3000
NODE_ENV=production
```

### 5️⃣ FINALIZE (0 min)

```bash
1. Railway → Copie Domain (URL)
2. Hotmart → Edite webhook
3. URL: https://sua-url-railway.app/webhook/hotmart
4. Salve
```

---

## TESTE EM 10 SEGUNDOS

```bash
# Health check
curl https://sua-url-railway.app/health

# Resposta esperada:
{"status":"ok","timestamp":"2025-01-30T..."}
```

---

## PRONTO! 🎉

**Próxima compra na Hotmart →** aluno entra automático no Classroom

---

## DÚVIDAS?

📖 [Guia Completo](./DEPLOYMENT_GUIDE.md) - Passo a passo detalhado  
📘 [README](./README.md) - Documentação técnica  
🐛 [GitHub Issues](https://github.com/luizvianaadm-dev/hotmart-classroom-webhook/issues)

---

**Versão:** 1.0.0  
**Última atualização:** 30 de dezembro de 2025
