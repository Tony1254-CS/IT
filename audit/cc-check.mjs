/* cc-check.mjs — Concierge widget acceptance run.
   Serves public/quintessence.html locally via file:// and asserts every
   claim the widget makes about itself. Renders shots into audit/shots/.
   Waits are event-driven (waitForFunction): the page ships a canvas +
   cursor rAF loop that can delay timers, so fixed sleeps would flake. */
import { chromium, devices } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, '..', 'public', 'quintessence.html');
const url = pathToFileURL(file).href;
const shots = join(here, 'shots');
mkdirSync(shots, { recursive: true });

let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) { pass++; console.log('  PASS', name); }
  else { fail++; console.log('  FAIL', name, detail ? '— ' + detail : ''); }
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- 0. static syntax check of all script blocks ---------- */
{
  const src = readFileSync(file, 'utf8');
  const blocks = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  let bad = 0;
  blocks.forEach((b, i) => {
    try { new vm.Script(b); } catch (e) { bad++; console.log('  FAIL syntax block', i + 1, '—', e.message); }
  });
  ok('all script blocks compile', bad === 0);
}

/* wait until the log's text contains a phrase (unique per reply) */
const seen = (page, re) =>
  page.waitForFunction(re => {
    const l = document.getElementById('cclog');
    return !!l && re.test(l.textContent);
  }, re, { timeout: 8000 }).then(() => ok('reply → ' + String(re).slice(1, 80), true))
    .catch(() => ok('reply → ' + String(re).slice(1, 80), false, 'timed out after 8s'));

/* wait until the panel state matches .on or not */
const panelOn = (page, on, name) =>
  page.waitForFunction(on => document.getElementById('ccv').classList.contains('on') === on, on, { timeout: 8000 })
    .then(() => ok(name, true)).catch(() => ok(name, false, 'timed out'));

const browser = await chromium.launch();

/* ---------- 1. desktop ---------- */
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'load' });
await sleep(600);

ok('pill rendered', await page.locator('#ccb').isVisible());
ok('panel starts hidden', await page.evaluate(() => !document.getElementById('ccv').classList.contains('on')));

await page.click('#ccb');
await sleep(300);
ok('aria-expanded true after open', (await page.getAttribute('#ccb', 'aria-expanded')) === 'true');
ok('typing dots visible before first reply', (await page.locator('#cclog .cc-ty').count()) === 1);
await seen(page, /answers strictly from this site/);
ok('focus lands on the input', (await page.evaluate(() => document.activeElement.id)) === 'ccin');

/* ---------- 2. chips ---------- */
const chipLabels = await page.locator('#cchips button').allTextContents();
ok('five chips offered', chipLabels.length === 5, JSON.stringify(chipLabels));
ok('chip names as designed',
  JSON.stringify(chipLabels) === JSON.stringify(['What do you do', 'How projects start', 'Engagement & pricing', 'Security commitments', 'Where you are based']));

await page.getByRole('button', { name: 'What do you do', exact: true }).click();
await seen(page, /One studio, six capabilities/);

await page.getByRole('button', { name: 'How projects start', exact: true }).click();
await seen(page, /statement of work/);

/* ---------- 3. typed questions ---------- */
const ask = async (q, re) => {
  await page.fill('#ccin', q);
  await page.click('#ccsend');
  await seen(page, re);
};

await ask('how much does a project cost', /No public price list/);
await ask('bangla ocr', /Bangla language as a first-class capability/);
await ask('penetration test', /written authorization/);
await ask('where are you based', /Bangladesh first/);
await ask('what is the meaning of life', /Scripted by design/);

/* ---------- 4. desktop shot with transcript visible ---------- */
await sleep(400);
await page.screenshot({ path: join(shots, 'cc-desktop.png') });

/* ---------- 5. honesty gates ---------- */
const fullText = await page.evaluate(() => document.getElementById('cclog').textContent);
ok('no email address invented', !fullText.includes('@'));
await page.waitForFunction(() => document.querySelectorAll('#cclog .cc-a a').length >= 5, null, { timeout: 5000 })
  .then(() => ok('in-chat links rendered', true), () => ok('in-chat links rendered', false));

/* ---------- 6. link click folds the panel ---------- */
await page.locator('#cclog .cc-a a').last().click();
await panelOn(page, false, 'panel closes after link click');

/* ---------- 7. Escape closes and returns focus ---------- */
await page.click('#ccb');
await panelOn(page, true, 'panel reopens without re-greeting');
await page.keyboard.press('Escape');
await panelOn(page, false, 'Escape closes the panel');
ok('focus returns to the pill', (await page.evaluate(() => document.activeElement.id)) === 'ccb');

/* ---------- 8. mobile ---------- */
const ctx = await browser.newContext({ ...devices['iPhone 13'] });
const mp = await ctx.newPage();
await mp.goto(url, { waitUntil: 'load' });
await sleep(600);
ok('[mobile] pill visible', await mp.locator('#ccb').isVisible());
await mp.click('#ccb');
await panelOn(mp, true, '[mobile] panel opens');
await seen(mp, /answers strictly from this site/);
const bb = await mp.locator('#ccv').boundingBox();
const vp = mp.viewportSize();
ok('[mobile] panel inside viewport',
  !!bb && bb.x >= 0 && bb.y >= 0 && bb.x + bb.width <= vp.width + 1 && bb.y + bb.height <= vp.height + 1,
  JSON.stringify({ bb, vp }));
await mp.screenshot({ path: join(shots, 'cc-mobile.png') });

await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
