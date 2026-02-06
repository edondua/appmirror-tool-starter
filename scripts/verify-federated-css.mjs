import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const srcDir = join(rootDir, 'src');
const allowedCssImportFiles = new Set([
  join(srcDir, 'main.tsx'),
  join(srcDir, 'Tool.tsx'),
]);
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mts', '.cts']);
const cssImportRegex = /import\s+(?:[^'"]+from\s+)?['"][^'"]+\.css(?:\?[^'"]*)?['"]/;
const disallowedFiles = [];

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
      continue;
    }

    const dotIndex = fullPath.lastIndexOf('.');
    const extension = dotIndex > -1 ? fullPath.slice(dotIndex) : '';
    if (!sourceExtensions.has(extension)) {
      continue;
    }

    const source = readFileSync(fullPath, 'utf8');
    if (!cssImportRegex.test(source)) {
      continue;
    }

    if (!allowedCssImportFiles.has(fullPath)) {
      disallowedFiles.push(fullPath.replace(`${rootDir}/`, ''));
    }
  }
}

walk(srcDir);

if (disallowedFiles.length > 0) {
  console.error('Federated CSS isolation check failed. Remove CSS imports from:');
  for (const file of disallowedFiles) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}
