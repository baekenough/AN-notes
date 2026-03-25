#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');
const locales = ['en', 'ko', 'es'];
const tools = ['claude-code', 'gpt-codex', 'gemini-cli'];

let errors = 0;

for (const tool of tools) {
  const ordersByLocale = {};

  for (const locale of locales) {
    const dir = path.join(contentDir, locale, tool);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
    const orders = {};

    for (const file of files) {
      const slug = file.replace(/\.mdx$/, '');
      const source = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data } = matter(source);

      const order = data.order;
      if (order === undefined) {
        console.error(`ERROR: Missing order field in ${locale}/${tool}/${slug}`);
        errors++;
        continue;
      }

      // Check duplicate orders within same locale/tool
      if (orders[order]) {
        console.error(`ERROR: Duplicate order ${order} in ${locale}/${tool}: ${orders[order]} and ${slug}`);
        errors++;
      }
      orders[order] = slug;
    }

    ordersByLocale[locale] = orders;
  }

  // Cross-locale consistency: en is the reference
  const referenceOrders = ordersByLocale['en'] || {};

  for (const locale of locales) {
    if (locale === 'en') continue;
    const localeOrders = ordersByLocale[locale] || {};

    for (const [order, slug] of Object.entries(referenceOrders)) {
      const localeSlug = localeOrders[order];
      if (localeSlug !== slug) {
        console.error(
          `ERROR: Order mismatch in ${tool}: en has "${slug}" at order ${order}, ${locale} has "${localeSlug || 'MISSING'}"`
        );
        errors++;
      }
    }

    for (const [order, slug] of Object.entries(localeOrders)) {
      if (!referenceOrders[order]) {
        console.error(`ERROR: Extra entry in ${locale}/${tool}/${slug} at order ${order} (not in en)`);
        errors++;
      }
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} error(s) found.`);
  process.exit(1);
} else {
  console.log('All curriculum validations passed.');
}
