import { Tool } from './content';

export type ToolMessageKey = 'claudeCode' | 'gptCodex' | 'geminiCli';

export interface ToolConfig {
  id: Tool;
  messageKey: ToolMessageKey;
  name: string;
  vendor: string;
  color: string;
  gradient: string;
  icon: string;
  status: 'active' | 'coming-soon';
  url: string;
  discoverySummary: string;
  discoveryTopics: string[];
}

export const tools: ToolConfig[] = [
  {
    id: 'claude-code',
    messageKey: 'claudeCode',
    name: 'Claude Code',
    vendor: 'Anthropic',
    color: 'text-orange-400',
    gradient: 'from-orange-500/20 to-amber-500/20',
    icon: 'C',
    status: 'active',
    url: 'https://docs.anthropic.com/en/docs/claude-code',
    discoverySummary:
      'Repo-native execution with agent teams, hooks, prompt design, and background worktrees.',
    discoveryTopics: ['agent teams', 'hooks', 'worktrees', 'prompting'],
  },
  {
    id: 'gpt-codex',
    messageKey: 'gptCodex',
    name: 'GPT Codex',
    vendor: 'OpenAI',
    color: 'text-emerald-400',
    gradient: 'from-emerald-500/20 to-green-500/20',
    icon: 'G',
    status: 'active',
    url: 'https://developers.openai.com/codex/quickstart',
    discoverySummary:
      'AGENTS.md, sandbox and approval controls, MCP, skills, and subagents for autonomous coding loops.',
    discoveryTopics: ['AGENTS.md', 'sandbox', 'MCP', 'subagents'],
  },
  {
    id: 'gemini-cli',
    messageKey: 'geminiCli',
    name: 'Gemini CLI',
    vendor: 'Google',
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    icon: 'G',
    status: 'active',
    url: 'https://geminicli.com/docs/',
    discoverySummary:
      'Long-context repo analysis, extensions, trusted folders, plan mode, and headless automation.',
    discoveryTopics: ['long context', 'extensions', 'plan mode', 'automation'],
  },
];

export function getToolConfig(id: Tool): ToolConfig {
  return tools.find(t => t.id === id)!;
}
