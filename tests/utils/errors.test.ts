import { AppError } from '../../src/utils/errors';

describe('AppError', () => {
  it('debe crear error con status code por defecto 500', () => {
    const error = new AppError('Algo salio mal');

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Algo salio mal');
    expect(error.statusCode).toBe(500);
  });

  it('debe crear error con status code personalizado', () => {
    const error = new AppError('No encontrado', 404);

    expect(error.statusCode).toBe(404);
  });
});
