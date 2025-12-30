# COMECE AQUI

> Projeto pronto para producao - Hotmart > Google Classroom (Automatico)

---

## O que eh isso?

Webhook que matricula alunos automaticamente no Google Classroom quando eles compram na Hotmart.

**Fluxo:**
```
Hotmart (Compra) -> Webhook -> Google Classroom (Matriculado)
Tempo total: ~3 segundos
```

---

## Documentacao Completa

### Estou com pressa (5 minutos)
Leia: **QUICK_START.md**

### Quero tudo explicado (30 minutos)
Leia: **DEPLOYMENT_GUIDE.md**

### Quero entender o codigo
Leia: **README.md**

---

## Estrutura do Projeto

```
src/server.ts              - Backend do webhook (Express + TypeScript)
package.json              - Dependencias Node.js
tsconfig.json             - Configuracao TypeScript
Procfile                  - Deploy Railway
.env.example              - Variaveis de ambiente
.gitignore                - Arquivos ignorados
README.md                 - Documentacao tecnica
DEPLOYMENT_GUIDE.md       - Guia passo a passo (30 min)
QUICK_START.md            - Atalho rapido (5 min)
START_HERE.md             - Este arquivo
```

---

## Escolha seu caminho:

| Se | Entao | Tempo |
|---|---|--------|
| Estou com pressa | QUICK_START.md | 5 min |
| Quero aprender bem | DEPLOYMENT_GUIDE.md | 30 min |
| Quero entender codigo | README.md | 15 min |

---

## Proximos Passos

1. Agora: Escolha um guia acima
2. Depois: Siga as instrucoes
3. Finalmente: Teste uma compra na Hotmart
4. Celebre: Aluno matriculado no Classroom!

---

## Requisitos Minimos

GitHub (conta gratuita)
Railway (conta gratuita - 500h/mes)
Google Cloud (credito de $300)
Hotmart (ja tem API)
Google Classroom (turma criada)

Custo Total: GRATUITO

---

Versao: 1.0.0
Status: Pronto para Producao
Data: 30 de dezembro de 2025
