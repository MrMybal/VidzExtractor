import assert from 'node:assert/strict';
import { readFile, access, mkdir, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = new URL('./', import.meta.url);
const output = new URL('../Documentation/', root);
const read = path => readFile(new URL(path, output), 'utf8');
const manifest = JSON.parse(await read('DocData/manifest.json'));
const report = JSON.parse(await read('DocData/translation-report.json'));
assert.deepEqual(report.missing, []);
assert.deepEqual(report.outdated, []);
assert.equal(report.current, 8);
assert.equal(manifest.defaultLocale, 'en');
assert.deepEqual(manifest.locales.map(item => item.code), ['en', 'fr']);
const en = manifest.pages.filter(item => item.locale === 'en');
assert.equal(en.length, 8);
for (const page of en) {
  const translated = manifest.pages.find(item => item.locale === 'fr' && item.id === page.id);
  assert.ok(translated, `Missing translation: ${page.id}`);
  assert.deepEqual(translated.headings.map(h => h.id), page.headings.map(h => h.id));
  for (const key of ['parent', 'previous', 'next']) assert.equal(translated[key], page[key]);
  assert.notEqual(translated.text, page.text);
  assert.ok(page.description && translated.description);
}
assert.ok(manifest.pages.every(page => page.kind === 'guide'));
assert.ok(!manifest.pages.some(page => /docai|translation-report|audit|source-file/.test(page.id)));
const files = await readdir(new URL('DocData/', output));
assert.deepEqual(files.filter(file => /^media-.*\.js$/.test(file)).sort(), ['media-graph.js', 'media-image.js']);
await access(new URL('DocData/THIRD-PARTY-NOTICES.txt', output));

const candidates = [process.env.CYDOC_BROWSER,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'];
let executablePath;
for (const candidate of candidates.filter(Boolean)) {
  if (await access(candidate).then(() => true, () => false)) { executablePath = candidate; break; }
}
const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}),
  args: ['--disable-background-networking', '--no-proxy-server'] });
const evidence = new URL('internal/', root);
await mkdir(evidence, { recursive: true });
const errors = [], remote = [], failed = [];
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, offline: true });
await context.route(/^https?:/, route => { remote.push(route.request().url()); return route.abort(); });
const page = await context.newPage();
page.setDefaultTimeout(10000);
page.on('pageerror', error => errors.push(error.message));
page.on('requestfailed', request => failed.push(request.url()));
const entry = pathToFileURL(fileURLToPath(new URL('Documentation.html', output))).href;
const title = () => page.locator('.article-title h1');
async function waitView() {
  await page.waitForFunction(() => {
    const [, locale, id] = location.hash.split('/');
    const doc = globalThis.CYDOC_DATA.pages.find(item => item.locale === locale && item.id === id);
    return doc && document.querySelector('.article-title h1')?.textContent === doc.title;
  });
}
async function open(locale, id, anchor = '') {
  await page.goto(`${entry}#/${locale}/${id}${anchor ? `/${anchor}` : ''}`);
  const expected = manifest.pages.find(item => item.id === id && item.locale === locale);
  await page.waitForFunction(expectedTitle => document.querySelector('.article-title h1')?.textContent === expectedTitle, expected.title);
  assert.equal(await page.locator('html').getAttribute('lang'), locale);
  if (anchor) assert.equal(await page.locator(`article [id="${anchor}"]`).count(), 1);
}
async function noOverflow() {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Horizontal overflow: ${page.url()}`);
}
async function theme(value) {
  await page.locator('.theme-picker summary').click();
  await page.locator(`[data-set-theme="${value}"]`).click();
}
const checks = [];
try {
  for (const locale of ['en', 'fr']) {
    for (const doc of en) {
      await open(locale, doc.id);
      assert.ok((await page.locator('article').innerText()).length > 300);
      const ids = await page.locator('article [id]').evaluateAll(elements => elements.map(element => element.id));
      assert.equal(new Set(ids).size, ids.length, `Duplicate rendered IDs in ${locale}/${doc.id}`);
      await noOverflow();
    }
    checks.push(`${locale}: all eight pages render with unique anchors and no page overflow`);
  }

  await open('en', 'overview');
  assert.equal(await page.locator('.pagination-previous').count(), 0);
  await page.locator('.pagination-next').click();
  await page.waitForURL(/#\/en\/installation$/);
  await waitView();
  assert.equal(await title().innerText(), 'Install or update');
  const parentGroup = page.locator('details.nav-group').filter({ has: page.locator('a[data-page="quickstart"]') }).last();
  assert.ok(await parentGroup.getAttribute('open') !== null);
  await page.locator('a[data-page="quickstart"]').click();
  await page.waitForURL(/#\/en\/quickstart$/);
  await waitView();
  await page.locator('article a[href="#/en/troubleshooting/no-video"]').first().evaluate(link => link.click());
  await page.waitForURL(/#\/en\/troubleshooting\/no-video$/);
  await page.locator('.locale-control select').selectOption('fr');
  await page.waitForURL(/#\/fr\/troubleshooting\/no-video$/);
  await waitView();
  assert.equal(await title().innerText(), 'Résoudre un problème');
  checks.push('Tree, learning path, internal link, explicit anchor and language switch preserve destinations');

  await page.keyboard.press('Control+k');
  await page.locator('.search-form input').fill('stockage');
  await page.locator('.search-result').first().waitFor();
  assert.ok((await page.locator('#search-results').innerText()).includes('stockage'));
  await page.locator('[data-search-kind]').selectOption('guide');
  await page.locator('.search-result').first().click();
  await page.locator('.article-title h1').waitFor();
  await page.keyboard.press('Control+k');
  assert.equal(await page.locator('[data-search-kind]').inputValue(), 'guide');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#documentation-search').evaluate(element => element.open), false);
  checks.push('Ctrl+K, French search, guide filter, result navigation and Escape');

  for (const locale of ['en', 'fr']) {
    await open(locale, 'overview', 'how-it-works');
    const diagram = page.locator('figure.diagram').first();
    await diagram.scrollIntoViewIfNeeded();
    await diagram.getByRole('button').click();
    await page.getByRole('dialog').filter({ has: page.locator('svg') }).waitFor();
    assert.equal(await page.evaluate(() => document.fullscreenElement), null);
    await page.keyboard.press('Escape');
    await diagram.locator('summary').click();
    assert.ok(await diagram.locator('details').getAttribute('open') !== null);
    await page.screenshot({ path: fileURLToPath(new URL(`desktop-flow-${locale}.png`, evidence)) });

    await open(locale, 'downloads', 'read-card');
    const image = page.locator('[data-cydoc-id="video-card"]');
    await image.scrollIntoViewIfNeeded();
    await image.locator('.image-layer img').waitFor();
    await page.waitForFunction(() => document.querySelector('.image-layer img')?.naturalWidth > 0);
    await image.hover();
    await image.locator('[data-action="expand"]').click();
    assert.ok((await image.getAttribute('class')).includes('media-expanded'));
    assert.equal(await page.evaluate(() => document.fullscreenElement), null);
    await page.keyboard.press('Escape');
    await page.screenshot({ path: fileURLToPath(new URL(`desktop-image-${locale}.png`, evidence)) });

    await open(locale, 'troubleshooting', 'diagnostic-map');
    const graph = page.locator('[data-cydoc-id="diagnostic-map"]');
    await graph.scrollIntoViewIfNeeded();
    await graph.locator('[data-graph="explore"]').waitFor();
    assert.ok(!(await graph.getAttribute('class')).includes('is-exploring'));
    await page.screenshot({ path: fileURLToPath(new URL(`desktop-graph-${locale}.png`, evidence)) });
    await graph.locator('.graph-text-view summary').click();
    await graph.locator('.graph-node-list > li').first().waitFor();
    assert.equal(await graph.locator('.graph-node-list > li').count(), 5);
    await graph.locator('[data-graph-search]').fill(locale === 'fr' ? 'stockage' : 'storage');
    assert.equal(await graph.locator('.graph-node-list > li').count(), 1);
    await graph.locator('[data-locate-node="export"]').click();
    assert.equal(await graph.locator('[data-node="export"]').getAttribute('aria-pressed'), 'true');
    await graph.locator('[data-graph="explore"]').click();
    assert.ok((await graph.getAttribute('class')).includes('is-exploring'));
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('+');
    await page.keyboard.press('Escape');
    assert.ok(!(await graph.getAttribute('class')).includes('is-exploring'));
    await graph.locator('.graph-details a').click();
    await page.waitForURL(new RegExp(`#/${locale}/troubleshooting/export-errors$`));
    checks.push(`${locale}: accessible diagrams, local image, in-window enlargement, graph text/search/node link and keyboard exploration`);
  }

  await open('fr', 'hls-export', 'saving-stages');
  await page.locator('figure.diagram').scrollIntoViewIfNeeded();
  await theme('light');
  await page.screenshot({ path: fileURLToPath(new URL('desktop-sequence-fr.png', evidence)) });
  await theme('dark');
  await page.screenshot({ path: fileURLToPath(new URL('desktop-sequence-dark-fr.png', evidence)) });

  // A path containing spaces and non-ASCII characters must remain a usable file URL.
  const { cp } = await import('node:fs/promises');
  const spaced = new URL('Lecteur été test/', evidence);
  await cp(output, spaced, { recursive: true });
  await page.goto(pathToFileURL(fileURLToPath(new URL('Documentation.html', spaced))).href + '#/fr/hls-export/save');
  await page.waitForFunction(() => document.querySelector('.article-title h1')?.textContent === 'Exporter une vidéo HLS');
  checks.push('Relocated offline folder with spaces and accented characters');

  const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, offline: true });
  await touchContext.route(/^https?:/, route => { remote.push(route.request().url()); return route.abort(); });
  const mobile = await touchContext.newPage();
  mobile.on('pageerror', error => errors.push(error.message));
  for (const locale of ['en', 'fr']) {
    for (const id of ['overview', 'downloads', 'hls-export', 'troubleshooting']) {
      await mobile.goto(`${entry}#/${locale}/${id}`);
      await mobile.locator('.article-title h1').waitFor();
      assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Mobile overflow: ${locale}/${id}`);
    }
    await mobile.locator('[data-menu]').click();
    await mobile.locator('a[data-page="downloads"]').click();
    await mobile.waitForURL(new RegExp(`#/${locale}/downloads$`));
    await mobile.locator('[data-cydoc-id="video-card"]').scrollIntoViewIfNeeded();
    const expand = mobile.locator('[data-cydoc-id="video-card"] [data-action="expand"]');
    await expand.waitFor({ state: 'visible' });
    await expand.tap();
    await mobile.screenshot({ path: fileURLToPath(new URL(`mobile-image-${locale}.png`, evidence)) });
    await mobile.keyboard.press('Escape');
  }
  await touchContext.close();
  checks.push('390px touch viewport: bilingual navigation, media controls, image enlargement and no horizontal page overflow');

  // Help links must open actual reader destinations, even when the host UI is a local fixture.
  // This does not claim a live Firefox extension test.
  for (const [file, hash] of [['popup.html', '#/fr/quickstart'], ['export.html', '#/fr/hls-export/save']]) {
    const host = await context.newPage();
    await host.route(/\/(popup|export)\.js$/, route => route.abort());
    await host.goto(pathToFileURL(fileURLToPath(new URL(`../${file}`, root))).href);
    const help = host.locator('a[aria-label^="Aide"]');
    assert.ok((await help.getAttribute('href')).endsWith(hash));
    const next = context.waitForEvent('page');
    await help.click();
    const opened = await next;
    await opened.locator('.article-title h1').waitFor();
    assert.ok(opened.url().endsWith(hash));
    await opened.close(); await host.close();
  }
  checks.push('Popup and HLS help links open the intended local French page/anchor');

  assert.deepEqual(remote, [], 'The reader attempted an external request');
  assert.deepEqual(failed, [], 'The reader has failed local resources');
  assert.deepEqual(errors, [], 'The reader raised JavaScript errors');
  await writeFile(new URL('verification.json', evidence), JSON.stringify({
    browser: await browser.version(), entry, cyDoc: '0.2.0', pages: manifest.pages.length,
    checks, remoteRequests: remote, failedRequests: failed, errors,
    limits: ['Headless Chromium; live Firefox extension behavior is not tested.',
      'Help links are exercised from local HTML fixtures with application scripts blocked.',
      'GitHub README rendering and other operating systems are not tested.']
  }, null, 2));
  console.log(`Verified ${manifest.pages.length} localized pages through file:// with network disabled.`);
  checks.forEach(check => console.log(`- ${check}`));
} catch (error) {
  await page.screenshot({ path: fileURLToPath(new URL('verification-failure.png', evidence)), fullPage: true }).catch(() => {});
  console.error({ url: page.url(), errors, failed, remote });
  throw error;
} finally {
  await browser.close();
}
