import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { getExampleSchema, createExampleSchema, updateExampleSchema } from './schemas';
import { exampleService } from './service';

const router = new Hono();

router.get('/', async (c) => {
  const result = await exampleService.getAll(c);
  return c.json({ data: result });
});

router.get('/:id', zValidator('param', getExampleSchema), async (c) => {
  const { id } = c.req.valid('param');
  const result = await exampleService.getById(c, id);
  if (!result) return c.json({ error: 'Not found' }, 404);
  return c.json({ data: result });
});

router.post('/', zValidator('json', createExampleSchema), async (c) => {
  const data = c.req.valid('json');
  const result = await exampleService.create(c, data);
  return c.json({ data: result }, 201);
});

router.put('/:id', zValidator('param', getExampleSchema), zValidator('json', updateExampleSchema), async (c) => {
  const { id } = c.req.valid('param');
  const data = c.req.valid('json');
  const result = await exampleService.update(c, id, data);
  return c.json({ data: result });
});

router.delete('/:id', zValidator('param', getExampleSchema), async (c) => {
  const { id } = c.req.valid('param');
  await exampleService.delete(c, id);
  return c.json({ success: true });
});

export default router;
