import { Router, Request, Response } from 'express';
import { tools } from '../data/tools';
import logger from '../utils/logger';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  logger.info('Listando herramientas', { count: tools.length });
  return res.json(tools);
});

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const tool = tools.find((t) => t.id === id);

  if (!tool) {
    logger.warn('Herramienta no encontrada', { id });
    return res.status(404).json({ error: 'Herramienta no encontrada' });
  }

  logger.info('Herramienta consultada', { id });
  return res.json(tool);
});

export default router;
