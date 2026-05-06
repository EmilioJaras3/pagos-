import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { usePaymentIntent } from './usePaymentIntent';
import { api } from '../api';

vi.mock('../api', () => ({
  api: {
    post: vi.fn(),
  },
}));

describe('usePaymentIntent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates payment intent successfully', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { clientSecret: 'cs_test_123', paymentIntentId: 'pi_123' },
    });

    const { result } = renderHook(() => usePaymentIntent(150));

    await act(async () => {
      result.current.createPaymentIntent();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.clientSecret).toBe('cs_test_123');
    expect(result.current.paymentId).toBe('pi_123');
    expect(result.current.error).toBeNull();
    expect(result.current.result).toBeNull();
  });

  it('handles API failure', async () => {
    vi.mocked(api.post).mockRejectedValueOnce(new Error('Server error'));

    const { result } = renderHook(() => usePaymentIntent(150));

    await act(async () => {
      result.current.createPaymentIntent();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.clientSecret).toBeNull();
    expect(result.current.error).toBe('Server error');
    expect(result.current.result).toBe('error');
  });

  it('resets state', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { clientSecret: 'cs_test_123', paymentIntentId: 'pi_123' },
    });

    const { result } = renderHook(() => usePaymentIntent(150));

    await act(async () => {
      result.current.createPaymentIntent();
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.reset();
    });

    expect(result.current.clientSecret).toBeNull();
    expect(result.current.paymentId).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.result).toBeNull();
  });

  it('handles card decline via handleError', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { clientSecret: 'cs_test_123', paymentIntentId: 'pi_123' },
    });

    const { result } = renderHook(() => usePaymentIntent(150));

    await act(async () => {
      result.current.createPaymentIntent();
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleError('Tu tarjeta fue rechazada');
    });

    expect(result.current.error).toBe('Tu tarjeta fue rechazada');
    expect(result.current.result).toBe('error');
  });

  it('retries payment after failure', async () => {
    vi.mocked(api.post)
      .mockRejectedValueOnce(new Error('Server error'))
      .mockResolvedValueOnce({
        data: { clientSecret: 'cs_retry', paymentIntentId: 'pi_retry' },
      });

    const { result } = renderHook(() => usePaymentIntent(200));

    await act(async () => {
      result.current.createPaymentIntent();
    });
    await waitFor(() => expect(result.current.result).toBe('error'));

    act(() => {
      result.current.reset();
    });

    await act(async () => {
      result.current.createPaymentIntent();
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.clientSecret).toBe('cs_retry');
    expect(result.current.paymentId).toBe('pi_retry');
    expect(result.current.result).toBeNull();
  });
});
