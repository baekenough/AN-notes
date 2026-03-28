import { Tool } from './content';

export interface ToolConfig {
  id: Tool;
  name: string;
  vendor: string;
  color: string;
  gradient: string;
  icon: string;
  status: 'active' | 'coming-soon';
  url: string;
}

export const tools: ToolConfig[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    vendor: 'Anthropic',
    color: 'text-orange-400',
    gradient: 'from-orange-500/20 to-amber-500/20',
    icon: 'C',
    status: 'active',
    url: 'https://docs.anthropic.com/en/docs/claude-code',
  },
  {
    id: 'gpt-codex',
    name: 'GPT Codex',
    vendor: 'OpenAI',
    color: 'text-emerald-400',
    gradient: 'from-emerald-500/20 to-green-500/20',
    icon: 'G',
    status: 'active',
    url: 'https://developers.openai.com/codex/quickstart',
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    vendor: 'Google',
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    icon: 'G',
    status: 'active',
    url: 'https://geminicli.com/docs/',
  },
];

export function getToolConfig(id: Tool): ToolConfig {
  return tools.find(t => t.id === id)!;
}
