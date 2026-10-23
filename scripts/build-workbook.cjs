/* The website HTML is the sole source of booklet content and reading order. */
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');

(async () => {
  const source = await fs.readFile(path.join(root, 'index.html'), 'utf8');
  const main = source.match(/<main\b[^>]*>([\s\S]*?)<\/main>/);
  if (!main) throw new Error('Workshop content is missing');
  let count = 0;
  const content = main[1]
    .replace(/<div id="part-navigation"[^>]*><\/div>/, '')
    .replace(/<article\b[^>]*>[\s\S]*?<\/article>/g, article => {
      count++;
      return article.replace(/^(<article\b[^>]*?) hidden(?=>)/, '$1')
        .replace(/(<span class="page-position">)[\s\S]*?(<\/span>)/, `$1${String(count).padStart(2, '0')} / __TOTAL__$2`);
    })
    .replace(/__TOTAL__/g, String((main[1].match(/<article\b/g) || []).length))
    .replace(/href="\?slide=(\d+)"/g, 'href="#slide-$1"')
    .replace(/ loading="lazy"/g, '');
  if (count < 1) throw new Error('No workshop pages found');
  const html = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Oracle AI Adoption Workshop</title><link rel="stylesheet" href="vendor/redwood/oj-redwood-min.css"><link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="workbook.css"></head><body><main>${content}</main></body></html>`;
  const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.ttf':'font/ttf'};
  const server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname === '/__workbook.html') {
        response.writeHead(200, {'Content-Type':'text/html'}); response.end(html); return;
      }
      const file = path.resolve(root, '.' + pathname);
      if (!file.startsWith(root + path.sep)) { response.writeHead(403); response.end(); return; }
      const data = await fs.readFile(file);
      response.writeHead(200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream'}); response.end(data);
    } catch { response.writeHead(404); response.end(); }
  });
  let browser;
  try {
    await new Promise((resolve, reject) => server.once('error', reject).listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({headless:true});
    const page = await browser.newPage({viewport:{width:816,height:1056}});
    const failures = [];
    page.on('requestfailed', request => failures.push(request.url()));
    page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
    await page.goto(`http://127.0.0.1:${server.address().port}/__workbook.html`, {waitUntil:'networkidle'});
    await page.emulateMedia({media:'print'});
    await page.evaluate(() => {
      for (const section of document.querySelectorAll('.lab-section')) {
        if (!section.querySelector(':scope > .screenshot') || !section.textContent.trim()) continue;
        const text = section.textContent.replace(/\s/g, '');
        const copy = document.createElement('div');
        const figures = document.createElement('div');
        copy.className = 'booklet-copy';
        for (const node of [...section.childNodes]) {
          (node.nodeType === 1 && node.matches('.screenshot') ? figures : copy).append(node);
        }
        section.classList.add('booklet-columns');
        section.append(copy, figures);
        if (section.textContent.replace(/\s/g, '') !== text) throw new Error('Booklet section text changed');
      }
    });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(img => img.decode()));
    });
    if (failures.length) throw new Error('Missing booklet resources: ' + failures.join(', '));
    const audit = await page.evaluate(() => ({
      pages:document.querySelectorAll('article').length,
      brokenImages:[...document.images].filter(img => !img.naturalWidth).length,
      unresolvedLinks:[...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(href => !document.getElementById(href.slice(1))),
      clippedElements:[...document.querySelectorAll('article h1,article p,article li,figure')].filter(el => {
        const bounds = el.getBoundingClientRect();
        return bounds.width && (bounds.left < -1 || bounds.right > 817);
      }).length
    }));
    if (audit.pages !== count || audit.brokenImages || audit.unresolvedLinks.length || audit.clippedElements) throw new Error('Booklet check failed: ' + JSON.stringify(audit));
    await fs.mkdir(path.join(root, 'downloads'), {recursive:true});
    await page.pdf({path:path.join(root,'downloads/oracle-ai-adoption-workbook.pdf'),format:'Letter',landscape:false,margin:{top:0,right:0,bottom:0,left:0},printBackground:true,preferCSSPageSize:true,tagged:true,outline:true});
    console.log(`Workbook generated from ${count} workshop pages; all images and internal destinations verified.`);
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
