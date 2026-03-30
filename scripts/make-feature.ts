import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'util';

const { positionals } = parseArgs({
  args: Bun.argv,
  options: {},
  allowPositionals: true,
});

// Bun.argv pattern: [bun, script.ts, ...args]
const featureName = positionals[2];

if (!featureName) {
  console.error("❌ Please provide a feature name. Example: bun run make:feature users");
  process.exit(1);
}

const formatFeatureName = (name: string) => name.toLowerCase();
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const feature = formatFeatureName(featureName);
const FeatureCapitalized = capitalize(feature);

const rootDir = process.cwd();
const featureDir = join(rootDir, 'src', 'features', feature);

const createRoutesContent = (name: string, Name: string) => `import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { get${Name}Schema, create${Name}Schema, update${Name}Schema } from './schemas';
import { ${name}Service } from './service';

const router = new Hono();

router.get('/', async (c) => {
  const result = await ${name}Service.getAll(c);
  return c.json({ data: result });
});

router.get('/:id', zValidator('param', get${Name}Schema), async (c) => {
  const { id } = c.req.valid('param');
  const result = await ${name}Service.getById(c, id);
  if (!result) return c.json({ error: 'Not found' }, 404);
  return c.json({ data: result });
});

router.post('/', zValidator('json', create${Name}Schema), async (c) => {
  const data = c.req.valid('json');
  const result = await ${name}Service.create(c, data);
  return c.json({ data: result }, 201);
});

router.put('/:id', zValidator('param', get${Name}Schema), zValidator('json', update${Name}Schema), async (c) => {
  const { id } = c.req.valid('param');
  const data = c.req.valid('json');
  const result = await ${name}Service.update(c, id, data);
  return c.json({ data: result });
});

router.delete('/:id', zValidator('param', get${Name}Schema), async (c) => {
  const { id } = c.req.valid('param');
  await ${name}Service.delete(c, id);
  return c.json({ success: true });
});

export default router;
`;

const createServiceContent = (name: string, Name: string) => `import { Context } from 'hono';

export const ${name}Service = {
  async getAll(c: Context) {
    return [{ id: '1', name: 'Example ${Name}' }];
  },
  
  async getById(c: Context, id: string) {
    return { id, name: \`Example \${id}\` };
  },
  
  async create(c: Context, data: any) {
    return { id: Math.random().toString(36).slice(2), ...data };
  },
  
  async update(c: Context, id: string, data: any) {
    return { id, ...data };
  },
  
  async delete(c: Context, id: string) {
    return true;
  }
};
`;

const createSchemasContent = (Name: string) => `import { z } from 'zod';

export const get${Name}Schema = z.object({
  id: z.string().min(1)
});

export const create${Name}Schema = z.object({
  name: z.string().min(1)
});

export const update${Name}Schema = create${Name}Schema.partial();
`;

const createTestContent = (name: string, Name: string) => `import { describe, expect, it } from 'bun:test';
import { Hono } from 'hono';
import \${name}Routes from './routes';

describe('\${Name} Routes', () => {
  const app = new Hono();
  app.route('/', \${name}Routes);

  it('GET / should return all \${name}', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('data');
  });

  it('POST / should create a \${name}', async () => {
    const res = await app.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test \${Name}' })
    });
    expect(res.status).toBe(201);
  });
});
`;

async function main() {
  try {
    console.log(`🚀 Generating feature module: ${feature}...`);
    
    // Create folder
    await mkdir(featureDir, { recursive: true });
    
    // Create files
    await writeFile(join(featureDir, 'routes.ts'), createRoutesContent(feature, FeatureCapitalized));
    await writeFile(join(featureDir, 'service.ts'), createServiceContent(feature, FeatureCapitalized));
    await writeFile(join(featureDir, 'schemas.ts'), createSchemasContent(FeatureCapitalized));
    
    console.log(`✅ Successfully created the ${FeatureCapitalized} feature at src/features/${feature}`);
    console.log(`\n📌 Next steps: Add the router to your app.ts:`);
    console.log(`  import ${feature}Routes from './features/${feature}/routes';`);
    console.log(`  app.route('/${feature}', ${feature}Routes);`);
  } catch (err: any) {
    console.error(`❌ Error generating feature: ${err.message}`);
    process.exit(1);
  }
}

main();
