import { build } from 'esbuild';

await build({
  entryPoints: ['src/server/vercel.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'api/index.js',
  packages: 'external',
  sourcemap: true,
});