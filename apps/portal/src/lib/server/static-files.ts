import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.pf_meta': 'application/octet-stream',
  '.pf_index': 'application/octet-stream',
  '.pf_fragment': 'application/octet-stream',
  '.pagefind': 'application/octet-stream',
  '.wasm': 'application/wasm'
};

export interface StaticFile {
  body: Buffer;
  type: string;
}

async function isFile(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

/**
 * Find a file in a static build directory, as a static host would:
 * exact file, then `<path>/index.html`. Paths outside `root` resolve to null.
 */
export async function loadStaticFile(root: string, urlPath: string): Promise<StaticFile | null> {
  const base = resolve(root);
  let decoded: string;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  const target = resolve(join(base, decoded));
  if (target !== base && !target.startsWith(base + sep)) return null;

  for (const candidate of [target, join(target, 'index.html')]) {
    if (await isFile(candidate)) {
      return {
        body: await readFile(candidate),
        type: MIME[extname(candidate).toLowerCase()] ?? 'application/octet-stream'
      };
    }
  }
  return null;
}
