const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
const endpoint = 'http://127.0.0.1:9224';
async function probe() {
  try {
    const res = await fetch(endpoint + '/json/version', {signal: AbortSignal.timeout(1000)});
    const info = await res.json();
    return info.webSocketDebuggerUrl ? info : null;
  } catch { return null; }
}
async function main() {
  if (process.argv.includes('--check')) {
    console.log('Node.js ' + process.versions.node + '; endpoint=' + endpoint);
    return;
  }
  if (await probe()) throw new Error('9224 端口已被使用。先运行 check-browser.cjs 核实是否为正确的专用窗口，避免连接错误会话。');
  const candidates = [process.env.JST_CHROME_PATH,
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, 'Google/Chrome/Application/chrome.exe'),
    process.env['PROGRAMFILES(X86)'] && path.join(process.env['PROGRAMFILES(X86)'], 'Google/Chrome/Application/chrome.exe'),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe')];
  const executable = candidates.find(p => p && fs.existsSync(p));
  if (!executable) throw new Error('找不到 Chrome。安装 Chrome 或设置 JST_CHROME_PATH。');
  const profile = path.resolve(__dirname, '../.local/chrome-profile');
  fs.mkdirSync(profile, {recursive:true});
  let log = '', exitCode;
  const child = spawn(executable, ['--remote-debugging-address=127.0.0.1', '--remote-debugging-port=9224',
    '--user-data-dir=' + profile, '--disable-gpu', '--no-first-run', 'https://w.erp321.com/epaas'],
    {stdio:['ignore','pipe','pipe']});
  child.on('error', e => { console.error(e.message); process.exitCode = 1; });
  child.on('exit', code => { exitCode = code; });
  for (const stream of [child.stdout, child.stderr]) stream.on('data', d => { log = (log + d.toString()).slice(-6000); });
  for (let attempt = 0; attempt < 30; attempt++) {
    if (await probe()) {
      console.log('CONNECTED: 已验证调试端口。请在专用 Chrome 登录聚水潭，再运行 check-browser.cjs 验证页面。');
      console.log('保持当前窗口运行；关闭专用 Chrome 后本脚本结束。');
      return;
    }
    if (exitCode !== undefined) break;
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error('调试端口未启动。Chrome退出码=' + exitCode + '\n' + log);
}
main().catch(e => { console.error(e.message); process.exitCode=1; });
