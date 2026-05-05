describe('validateConfig', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('debe lanzar error si falta STRIPE_SECRET_KEY', async () => {
    delete process.env.STRIPE_SECRET_KEY;

    const { validateConfig } = await import('../../src/config');

    expect(() => validateConfig()).toThrow('STRIPE_SECRET_KEY');
  });

  it('no debe lanzar error si todas las variables estan presentes', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_present';

    const { validateConfig } = await import('../../src/config');

    expect(() => validateConfig()).not.toThrow();
  });
});
