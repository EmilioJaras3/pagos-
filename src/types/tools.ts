import { z } from 'zod';

export const toolIdSchema = z.string().regex(/^tool-\d{3}$/);
export type ToolId = z.infer<typeof toolIdSchema>;
