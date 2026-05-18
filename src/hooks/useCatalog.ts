import { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import type { Tool } from '../types/tool';

export interface UseCatalogResult {
  tools: Tool[];
  loading: boolean;
  error: string | null;
}

export function useCatalog(): UseCatalogResult {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const controller = new AbortController();

    async function fetchTools() {
      try {
        const { data } = await api.get<Tool[]>('/api/tools', {
          signal: controller.signal,
        });
        if (!mountedRef.current) return;
        setTools(data);
      } catch (err) {
        if (!mountedRef.current) return;
        if ((err as Error).name === 'CanceledError' || (err as Error).name === 'AbortError') {
          return;
        }
        const message = err instanceof Error ? err.message : 'Error al cargar el catálogo';
        setError(message);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }

    fetchTools();

    return () => {
      mountedRef.current = false;
      controller.abort();
    };
  }, []);

  return { tools, loading, error };
}
