const defaultBaseUrl = process.argv[2] || 'https://annotes.baekenough.com';

function normalizeBaseUrl(raw) {
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
}

const baseUrl = normalizeBaseUrl(defaultBaseUrl);

const checks = [
  {name: 'Homepage', path: '/en', type: 'html', mustInclude: ['What is AI Native Notes', 'FAQPage', 'Shows how to run Codex safely with AGENTS.md']},
  {name: 'Tool index', path: '/en/gpt-codex', type: 'html', mustInclude: ['CollectionPage', 'BreadcrumbList']},
  {name: 'Article page', path: '/en/gpt-codex/codex-getting-started', type: 'html', mustInclude: ['Article', 'BreadcrumbList']},
  {name: 'What\'s New', path: '/en/whats-new', type: 'html', mustInclude: ['CollectionPage', 'BreadcrumbList']},
  {name: 'llms.txt', path: '/llms.txt', type: 'text', mustInclude: ['## Audience', '## Freshness signals']},
  {name: 'agents.txt', path: '/agents.txt', type: 'text', mustInclude: ['== DISCOVERY RULES ==', 'AUDIENCE: developers, engineering teams, autonomous agents']},
  {name: 'OG image', path: '/opengraph-image', type: 'image'},
  {name: 'Twitter image', path: '/twitter-image', type: 'image'},
];

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'AN-Notes-SEO-Release-Check/1.0',
    },
    redirect: 'follow',
  });

  const body = await response.text();
  return {response, body};
}

async function fetchHead(url) {
  let response = await fetch(url, {method: 'HEAD', redirect: 'follow'});
  if (!response.ok || !response.headers.get('content-type')) {
    response = await fetch(url, {method: 'GET', redirect: 'follow'});
    await response.arrayBuffer();
  }
  return response;
}

let failed = false;

console.log(`SEO release checks for ${baseUrl}`);
console.log('');

for (const check of checks) {
  const url = `${baseUrl}${check.path}`;

  try {
    if (check.type === 'image') {
      const response = await fetchHead(url);
      const contentType = response.headers.get('content-type') || '';
      const ok = response.ok && contentType.includes('image/png');
      console.log(`${ok ? 'PASS' : 'FAIL'} ${check.name} -> ${response.status} ${url} ${contentType}`);
      if (!ok) failed = true;
      continue;
    }

    const {response, body} = await fetchText(url);
    const missing = (check.mustInclude || []).filter((token) => !body.includes(token));
    const ok = response.ok && missing.length === 0;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${check.name} -> ${response.status} ${url}`);
    if (missing.length > 0) {
      console.log(`  Missing: ${missing.join(' | ')}`);
    }
    if (!ok) failed = true;
  } catch (error) {
    failed = true;
    console.log(`FAIL ${check.name} -> ${url}`);
    console.log(`  ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log('');
  console.log('All SEO release checks passed.');
}
