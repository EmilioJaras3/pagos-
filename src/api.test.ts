import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCreate = vi.fn();
vi.mock('axios', () => ({
  default: {
    create: mockCreate,
  },
}));

describe('api', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mockCreate.mockReturnValue({ post: vi.fn(), get: vi.fn() });
  });

  it('uses VITE_API_URL when defined', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com');
    await import('./api');

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: 'https://api.example.com' })
    );
  });

  it('falls back to empty baseURL when VITE_API_URL is missing', async () => {
    vi.stubEnv('VITE_API_URL', undefined);
    await import('./api');

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: '' })
    );
  });
});
