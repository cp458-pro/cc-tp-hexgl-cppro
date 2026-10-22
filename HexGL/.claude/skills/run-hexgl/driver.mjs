// Pilote HexGL sans dépendance : serveur statique + Chrome headless + CDP (Node >= 22, WebSocket natif).
// Usage (depuis HexGL/) : node .claude/skills/run-hexgl/driver.mjs [dossier-captures] [secondes-de-course]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import os from 'node:os';

const out = path.resolve(process.argv[2] || 'run-out');
const raceSecs = Number(process.argv[3] || 8);
const PORT = Number(process.env.HEXGL_PORT || 8765), DBG = 9333;
const CHROME = process.env.CHROME || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/chromium', '/usr/bin/google-chrome'].find(p => fs.existsSync(p));
fs.mkdirSync(out, { recursive: true });

const types = { html: 'text/html', js: 'text/javascript', css: 'text/css', png: 'image/png', jpg: 'image/jpeg', json: 'application/json', mp3: 'audio/mpeg', ogg: 'audio/ogg' };
const server = http.createServer((q, r) => {
  const f = path.join(process.cwd(), decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
  fs.readFile(f, (e, d) => e ? (r.writeHead(404), r.end()) : (r.writeHead(200, { 'content-type': types[f.split('.').pop()] || 'application/octet-stream' }), r.end(d)));
}).listen(PORT);

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'hexgl-'));
const chrome = spawn(CHROME, ['--headless=new', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--window-size=1280,720',
  `--remote-debugging-port=${DBG}`, `--user-data-dir=${profile}`, '--autoplay-policy=no-user-gesture-required', 'about:blank'], { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function connect() {
  for (let i = 0; i < 50; i++) {
    try {
      const t = (await (await fetch(`http://127.0.0.1:${DBG}/json`)).json()).find(x => x.type === 'page');
      if (t) return new WebSocket(t.webSocketDebuggerUrl);
    } catch {}
    await sleep(200);
  }
  throw new Error('Chrome injoignable');
}
const ws = await connect();
await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pend = new Map(); const logs = [];
ws.addEventListener('message', m => {
  const d = JSON.parse(m.data);
  if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  else if (d.method === 'Runtime.exceptionThrown') logs.push('EXC ' + d.params.exceptionDetails.text + ' ' + (d.params.exceptionDetails.exception?.description || ''));
  else if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') logs.push('console.error ' + d.params.args.map(a => a.value ?? a.description).join(' '));
});
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result?.result?.value;
const shot = async name => { const d = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, name), Buffer.from(d.result.data, 'base64')); console.log('capture', path.join(out, name)); };
const key = (type, k, code, vk) => send('Input.dispatchKeyEvent', { type, key: k, code, windowsVirtualKeyCode: vk });

try {
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  // qualité LOW accélère le rendu logiciel ; godmode évite de mourir contre les murs
  await send('Page.navigate', { url: `http://localhost:${PORT}/index.html` });
  await sleep(3000);
  console.log('webgl:', await ev(`!!document.createElement('canvas').getContext('webgl')`));
  await shot('1-menu.png');
  await ev(`document.getElementById('s-quality').click()`); // VERY HIGH -> LOW (le réglage boucle : 1 clic)
  await ev(`document.getElementById('s-godmode').click()`);
  console.log('godmode:', await ev(`document.getElementById('s-godmode').innerHTML`));
  console.log('quality:', await ev(`document.getElementById('s-quality').innerHTML`));
  await ev(`document.getElementById('start').click()`);
  await sleep(500); await shot('2-aide.png');
  await ev(`document.getElementById('step-2').click()`); // lance init() : chargement des assets
  for (let i = 0; i < 120; i++) { // attend la fin du chargement (step-4 visible = jeu prêt)
    if (await ev(`getComputedStyle(document.getElementById('step-4')).display !== 'none'`)) break;
    await sleep(1000);
  }
  await sleep(6000); // compte à rebours
  await shot('3-depart.png');
  const state = () => ev(`JSON.stringify({result: hexGL.gameplay.result, lap: hexGL.gameplay.lap, t: hexGL.gameplay.timer.time.elapsed|0})`);
  console.log('état au départ:', await state());
  await key('keyDown', 'ArrowUp', 'ArrowUp', 38);
  await sleep(raceSecs * 1000);
  console.log('état en course:', await state());
  await shot('4-course.png');
  await key('keyUp', 'ArrowUp', 'ArrowUp', 38);
  console.log('état final:', await state());
  console.log('erreurs JS:', logs.length ? logs : 'aucune');
} finally {
  ws.close(); chrome.kill(); server.close(); setTimeout(() => process.exit(), 500);
}
