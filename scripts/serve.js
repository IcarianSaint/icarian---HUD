const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' };

const server = http.createServer((request, response) => {
  const parsed = url.parse(request.url, true);
  let pathname = parsed.pathname;
  let requested = pathname === '/' ? '/ui/index.html' : pathname;

  // Route ?player query to player.html
  if (parsed.query.player || pathname === '/player') {
    requested = '/ui/player.html';
  }

  const file = path.resolve(root, `.${requested}`);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not found');
    return;
  }
  response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(response);
});

server.listen(port, () => console.log(`Icarian HUD preview: http://localhost:${port}\nPlayer: http://localhost:${port}?player`));
