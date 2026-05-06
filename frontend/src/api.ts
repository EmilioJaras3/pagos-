import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

export interface HealthStatus {
  ok: boolean;
  webhookConfigured: boolean;
}

export async function checkHealth(): Promise<HealthStatus> {
  try {
    const { data } = await api.get('/health');
    return { ok: data.status === 'ok', webhookConfigured: data.webhookConfigured ?? false };
  } catch {
    return { ok: false, webhookConfigured: false };
  }
}

export interface PaymentDetails {
  id: string;
  status: string;
  amount: number;
  currency: string;
}

export async function getPaymentDetails(paymentId: string): Promise<PaymentDetails> {
  const { data } = await api.get(`/api/payments/${paymentId}`);
  return data;
}
