import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCatalog } from './useCatalog';
import { api } from '../api';

vi.mock('../api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('useCatalog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna loading=true inicialmente', () => {
    const { result } = renderHook(() => useCatalog());
    expect(result.current.loading).toBe(true);
    expect(result.current.tools).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('fetch tools exitosamente', async () => {
    const mockTools = [
      { id: 'tool-001', name: 'Destornillador', description: 'Test', price: 45000 },
      { id: 'tool-002', name: 'Taladro', description: 'Test', price: 125000 },
    ];
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockTools });

    const { result } = renderHook(() => useCatalog());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.tools).toEqual(mockTools);
    expect(result.current.error).toBeNull();
    expect(api.get).toHaveBeenCalledWith('/api/tools', expect.any(Object));
  });

  it('cancela request al desmontar', async () => {
    vi.mocked(api.get).mockImplementation(() => new Promise(() => {}));

    const { unmount } = renderHook(() => useCatalog());
    unmount();

    expect(vi.mocked(api.get).mock.calls[0][1]).toHaveProperty('signal');
    expect(vi.mocked(api.get).mock.calls[0][1].signal.aborted).toBe(true);
  });

  it('maneja error del API', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useCatalog());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.tools).toEqual([]);
    expect(result.current.error).toBe('Network error');
  });
});
