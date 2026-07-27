// 零依赖静态服务器：伺服 out\ 目录。
// 静态导出后本地不再需要 Next，直接 node scripts\serve.mjs 即可，完全离线。

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'out');
const PORT = Number(process.env.PORT) || 3210;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

if (!fs.existsSync(path.join(DIR, 'index.html'))) {
  console.error(`[serve] 找不到构建产物：${DIR}`);
  console.error('[serve] 请先运行 npm run build');
  process.exit(1);
}

/** 把 URL 解析成 out\ 内的真实文件，越界一律拒绝 */
function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const full = path.join(DIR, path.normalize(p));
  // 防路径穿越：normalize 之后必须仍在 out\ 内
  if (full !== DIR && !full.startsWith(DIR + path.sep)) return null;
  if (fs.existsSync(full) && fs.statSync(full).isDirectory()) {
    const idx = path.join(full, 'index.html');
    return fs.existsSync(idx) ? idx : null;
  }
  if (fs.existsSync(full)) return full;
  // trailingSlash 模式下 /foo 也映射到 /foo/index.html
  const asDir = path.join(full, 'index.html');
  if (fs.existsSync(asDir)) return asDir;
  const asHtml = `${full}.html`;
  if (fs.existsSync(asHtml)) return asHtml;
  return null;
}

http
  .createServer((req, res) => {
    const file = resolveFile(req.url || '/');
    if (!file) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => {
    console.log(`[serve] MCQ Test running at http://localhost:${PORT}`);
  });
