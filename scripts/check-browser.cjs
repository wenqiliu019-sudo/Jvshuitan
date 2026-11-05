const {chromium} = require('playwright');
(async()=>{
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9224', {timeout:8000});
  try {
    const pages = browser.contexts().flatMap(c=>c.pages()).filter(p=>p.url().startsWith('https://w.erp321.com/epaas'));
    if (!pages.length) throw new Error('已连到浏览器，但没有聚水潭 epaas 页面。');
    for (const page of pages) console.log(JSON.stringify({url:page.url(), title:await page.title(), text:(await page.locator('body').innerText()).slice(0,2500)},null,2));
  } finally { await browser.close(); }
})().catch(e=>{console.error(e.message);process.exitCode=1;});
