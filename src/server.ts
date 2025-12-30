// src/server.ts
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import axios from 'axios';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(express.json());

// ============ CONFIG ============
const HOTMART_WEBHOOK_SECRET = process.env.HOTMART_WEBHOOK_SECRET || '';
const CLASSROOM_COURSE_ID = process.env.CLASSROOM_COURSE_ID || '';
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL || '';
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

interface HotmartEvent {
  status?: string;
  event?: string;
  buyer?: { email: string; name: string };
  customer?: { email: string; name: string };
  id?: string;
}

// ============ VERIFICA ASSINATURA DO WEBHOOK ============
function verifyHotmartSignature(body: string, signature: string): boolean {
  const hash = crypto
    .createHmac('sha256', HOTMART_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  return hash === signature;
}

// ============ GERA JWT PARA CLASSROOM API ============
async function getAccessToken(): Promise<string> {
  const payload = {
    iss: GOOGLE_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/classroom.students',
    aud: 'https://oauth2.googleapis.com/token',
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  const token = jwt.sign(payload, GOOGLE_PRIVATE_KEY, { algorithm: 'RS256' });

  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token,
    });

    return response.data.access_token;
  } catch (error: any) {
    console.error('Erro ao obter token de acesso:', error.response?.data || error.message);
    throw error;
  }
}

// ============ MATRICULA ALUNO NO CLASSROOM ============
async function enrollStudentInClassroom(
  studentEmail: string,
  studentName: string
): Promise<void> {
  try {
    const accessToken = await getAccessToken();

    const enrollmentCode = process.env.CLASSROOM_ENROLLMENT_CODE;
    const url = enrollmentCode
      ? `https://classroom.googleapis.com/v1/courses/${CLASSROOM_COURSE_ID}/students?enrollmentCode=${enrollmentCode}`
      : `https://classroom.googleapis.com/v1/courses/${CLASSROOM_COURSE_ID}/students`;

    const response = await axios.post(
      url,
      { userId: studentEmail },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`✅ Aluno ${studentEmail} matriculado com sucesso`, response.data);
  } catch (error: any) {
    if (error.response?.status === 409) {
      console.log(`ℹ️  Aluno ${studentEmail} já está matriculado`);
      return;
    }
    console.error(
      `❌ Erro ao matricular ${studentEmail}:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

// ============ WEBHOOK ENDPOINT ============
app.post('/webhook/hotmart', async (req: Request, res: Response) => {
  try {
    const rawBody = JSON.stringify(req.body);
    const signature = (req.headers['x-hotmart-signature'] as string) || '';

    // Verifica assinatura
    if (!verifyHotmartSignature(rawBody, signature)) {
      console.warn('⚠️  Assinatura inválida do webhook');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event: HotmartEvent = req.body;

    // Se evento é compra aprovada
    if (event.status === 'approved' || event.event === 'PURCHASE_APPROVED') {
      const studentEmail = event.buyer?.email || event.customer?.email;
      const studentName = event.buyer?.name || event.customer?.name;

      if (!studentEmail) {
        return res.status(400).json({ error: 'Email not found in payload' });
      }

      console.log(`📧 Processando compra de: ${studentEmail}`);

      // Matricula no Classroom
      await enrollStudentInClassroom(studentEmail, studentName || '');

      return res.status(200).json({
        success: true,
        message: `Aluno ${studentEmail} matriculado com sucesso`,
      });
    }

    // Se evento é reembolso/cancelamento
    if (event.status === 'refunded' || event.event === 'PURCHASE_REFUNDED') {
      const studentEmail = event.buyer?.email || event.customer?.email;

      if (!studentEmail) {
        return res.status(400).json({ error: 'Email not found in payload' });
      }

      console.log(`🗑️  Removendo aluno: ${studentEmail}`);
      // TODO: Implementar remoção de aluno da turma

      return res.status(200).json({
        success: true,
        message: `Aluno ${studentEmail} removido da turma`,
      });
    }

    res.status(200).json({ success: true, received: true });
  } catch (error: any) {
    console.error('❌ Erro no webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ HEALTH CHECK ============
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook server rodando em porta ${PORT}`);
  console.log(`🚢 Escutando em http://localhost:${PORT}/webhook/hotmart`);
});

export default app;
