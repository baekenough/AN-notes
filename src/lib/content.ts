import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { generateCurriculumNav } from './curriculum';

export type Tool = 'claude-code' | 'gpt-codex' | 'gemini-cli';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type ConnectionType = 'prerequisite' | 'enhances' | 'compare' | 'combines';

export interface TipConnection {
  slug: string;
  tool: Tool;
  type: ConnectionType;
}

export interface TipMeta {
  slug: string;
  tool: Tool;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  connections: TipConnection[];
  featured: boolean;
  order: number;
  readingTime: string;
  date: string;
}

export interface Tip extends TipMeta {
  content: string;
}

const contentDir = path.join(process.cwd(), 'content');

export function getTipsByTool(locale: string, tool: Tool): TipMeta[] {
  const dir = path.join(contentDir, locale, tool);

  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));

  return files
    .map(file => {
      const slug = file.replace(/\.mdx$/, '');
      const filePath = path.join(dir, file);
      const source = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(source);
      const stats = readingTime(content);

      return {
        slug,
        tool,
        title: data.title || slug,
        description: data.description || '',
        difficulty: data.difficulty || 'beginner',
        tags: data.tags || [],
        connections: data.connections || [],
        featured: data.featured || false,
        order: data.order || 999,
        readingTime: Math.ceil(stats.minutes).toString(),
        date: data.date || new Date().toISOString().split('T')[0],
      } as TipMeta;
    })
    .sort((a, b) => a.order - b.order);
}

function injectCurriculum(content: string, locale: string, tool: Tool, slug: string): string {
  const startMarker = '<!-- curriculum:start -->';
  const endMarker = '<!-- curriculum:end -->';

  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) return content;

  // Extract the "### Official docs" subsection to preserve it
  const existingBlock = content.slice(startIdx + startMarker.length, endIdx);
  const existingLines = existingBlock.split('\n');
  const h3Index = existingLines.findIndex(l => l.startsWith('### '));
  const officialDocs = h3Index >= 0 ? '\n' + existingLines.slice(h3Index).join('\n') : '';

  // Generate new curriculum nav from shared data
  const tips = getTipsByTool(locale, tool);
  const nav = generateCurriculumNav(tips, locale, tool, slug);
  if (!nav) return content;

  const newBlock = '\n' + nav + '\n' + officialDocs;

  return content.slice(0, startIdx + startMarker.length) + newBlock + content.slice(endIdx);
}

export function getTip(locale: string, tool: Tool, slug: string): Tip | null {
  const filePath = path.join(contentDir, locale, tool, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    // Fallback to English if translation not available
    const fallbackPath = path.join(contentDir, 'en', tool, `${slug}.mdx`);
    if (!fs.existsSync(fallbackPath)) return null;

    const source = fs.readFileSync(fallbackPath, 'utf8');
    const { data, content } = matter(source);
    const stats = readingTime(content);

    return {
      slug,
      tool,
      title: data.title || slug,
      description: data.description || '',
      difficulty: data.difficulty || 'beginner',
      tags: data.tags || [],
      connections: data.connections || [],
      featured: data.featured || false,
      order: data.order || 999,
      readingTime: Math.ceil(stats.minutes).toString(),
      date: data.date || new Date().toISOString().split('T')[0],
      content: injectCurriculum(content, locale, tool, slug),
    };
  }

  const source = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(source);
  const stats = readingTime(content);

  return {
    slug,
    tool,
    title: data.title || slug,
    description: data.description || '',
    difficulty: data.difficulty || 'beginner',
    tags: data.tags || [],
    connections: data.connections || [],
    featured: data.featured || false,
    order: data.order || 999,
    readingTime: Math.ceil(stats.minutes).toString(),
    date: data.date || new Date().toISOString().split('T')[0],
    content: injectCurriculum(content, locale, tool, slug),
  };
}

export function getAllTips(locale: string): TipMeta[] {
  const tools: Tool[] = ['claude-code', 'gpt-codex', 'gemini-cli'];
  return tools.flatMap(tool => getTipsByTool(locale, tool));
}

export function getConnectedTips(locale: string, connections: TipConnection[]): TipMeta[] {
  return connections
    .map(conn => {
      const tips = getTipsByTool(locale, conn.tool);
      const tip = tips.find(t => t.slug === conn.slug);
      if (tip) {
        return { ...tip, connectionType: conn.type };
      }
      return null;
    })
    .filter(Boolean) as TipMeta[];
}
