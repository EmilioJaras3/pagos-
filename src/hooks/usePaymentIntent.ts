import { useState, useCallback, useRef, useEffect } from 'react';
import { api } from '../api';
import type { Tool } from '../types/tool';

export interface CartItemData {
  tool: Tool;
  quantity: number;
}

export interface UsePaymentIntentResult {
  clientSecret: string | null;
  loading: boolean;
  error: string | null;
  paymentId: string | null;
  result: 'success' | 'error' | null;
  createPaymentIntent: () => Promise<void>;
  handleSuccess: () => void;
  handleError: (message?: string) => void;
  reset: () => void;
}

export function usePaymentIntent(amount: number, toolId?: string, cartItems?: CartItemData[]): UsePaymentIntentResult {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const createPaymentIntent = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload: Record<string, unknown> = {
        amount,
        currency: 'mxn',
      };
      if (toolId) {
        payload.toolId = toolId;
      }
      if (cartItems && cartItems.length > 0) {
        payload.items = cartItems.map((item) => ({
          toolId: item.tool.id,
          quantity: item.quantity,
        }));
      }
      const { data } = await api.post('/api/payments/create', payload);
      if (!mountedRef.current) return;
      setClientSecret(data.clientSecret);
      setPaymentId(data.paymentIntentId);
    } catch (err) {
      if (!mountedRef.current) return;
      const message = err instanceof Error ? err.message : 'Error al crear el intento de pago';
      setError(message);
      setResult('error');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [amount, toolId, cartItems]);

  const handleSuccess = useCallback(() => {
    setResult('success');
  }, []);

  const handleError = useCallback((message?: string) => {
    if (message) setError(message);
    setResult('error');
  }, []);

  const reset = useCallback(() => {
    setClientSecret(null);
    setPaymentId(null);
    setError(null);
    setResult(null);
  }, []);

  return {
    clientSecret,
    loading,
    error,
    paymentId,
    result,
    createPaymentIntent,
    handleSuccess,
    handleError,
    reset,
  };
}
