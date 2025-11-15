import { ToolDefinition } from './types';

/**
 * Definitions for all supported AI coding tools
 */
export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'claude',
    displayName: 'Claude Code',
    command: 'claude',
    versionFlag: '--version',
    versionRegex: /(\d+\.\d+\.\d+)/,
    installMethods: {
      npm: '@anthropic-ai/claude-code',
      github: {
        owner: 'anthropics',
        repo: 'claude-code',
      },
    },
    configPaths: ['~/.claude/config.json', '~/.config/claude/config.json'],
    homepage: 'https://claude.ai/code',
  },
  {
    name: 'gemini',
    displayName: 'Gemini CLI',
    command: 'gemini',
    versionFlag: '--version',
    versionRegex: /(\d+\.\d+\.\d+)/,
    installMethods: {
      npm: '@google/gemini-cli',
      pip: 'gemini-cli',
    },
    homepage: 'https://ai.google.dev/',
  },
  {
    name: 'codex',
    displayName: 'Codex CLI',
    command: 'codex',
    versionFlag: '--version',
    versionRegex: /(\d+\.\d+\.\d+)/,
    installMethods: {
      npm: 'openai-codex-cli',
      pip: 'codex-cli',
    },
  },
  {
    name: 'qwen',
    displayName: 'Qwen CLI',
    command: 'qwen',
    versionFlag: '-v',
    versionRegex: /(\d+\.\d+\.\d+)/,
    installMethods: {
      pip: 'qwen-cli',
      github: {
        owner: 'QwenLM',
        repo: 'Qwen',
      },
    },
    homepage: 'https://qwenlm.github.io/',
  },
  {
    name: 'iflow',
    displayName: 'iFlow',
    command: 'iflow',
    versionFlag: '--version',
    versionRegex: /(\d+\.\d+\.\d+)/,
    installMethods: {
      npm: 'iflow-cli',
    },
  },
  {
    name: 'crush',
    displayName: 'Crush',
    command: 'crush',
    versionFlag: '--version',
    versionRegex: /(\d+\.\d+\.\d+)/,
    installMethods: {
      npm: 'crush-cli',
      github: {
        owner: 'crush-ai',
        repo: 'crush',
      },
    },
  },
  {
    name: 'opencode',
    displayName: 'OpenCode',
    command: 'opencode',
    versionFlag: '--version',
    versionRegex: /(\d+\.\d+\.\d+)/,
    installMethods: {
      npm: 'opencode-cli',
      pip: 'opencode',
    },
  },
  {
    name: 'droid',
    displayName: 'Droid',
    command: 'droid',
    versionFlag: '--version',
    versionRegex: /(\d+\.\d+\.\d+)/,
    installMethods: {
      npm: 'droid-cli',
    },
  },
  {
    name: 'goose',
    displayName: 'Goose',
    command: 'goose',
    versionFlag: '--version',
    versionRegex: /(\d+\.\d+\.\d+)/,
    installMethods: {
      npm: 'goose-cli',
      pip: 'goose-ai',
      github: {
        owner: 'block',
        repo: 'goose',
      },
    },
    homepage: 'https://github.com/block/goose',
  },
  {
    name: 'cline',
    displayName: 'Cline',
    command: 'code',
    versionFlag: '--list-extensions',
    versionRegex: /saoudrizwan\.claude-dev@(\d+\.\d+\.\d+)/,
    installMethods: {
      // VS Code extension
    },
    homepage: 'https://github.com/saoudrizwan/claude-dev',
  },
  {
    name: 'copilot',
    displayName: 'GitHub Copilot CLI',
    command: 'github-copilot-cli',
    versionFlag: '--version',
    versionRegex: /(\d+\.\d+\.\d+)/,
    installMethods: {
      npm: '@githubnext/github-copilot-cli',
    },
    homepage: 'https://githubnext.com/projects/copilot-cli',
  },
  {
    name: 'codebuddy',
    displayName: 'CodeBuddy',
    command: 'codebuddy',
    versionFlag: '--version',
    versionRegex: /(\d+\.\d+\.\d+)/,
    installMethods: {
      npm: 'codebuddy-cli',
      pip: 'codebuddy',
    },
  },
  {
    name: 'kimi',
    displayName: 'Kimi CLI',
    command: 'kimi',
    versionFlag: '-v',
    versionRegex: /(\d+\.\d+\.\d+)/,
    installMethods: {
      pip: 'kimi-cli',
      github: {
        owner: 'MoonshotAI',
        repo: 'kimi-cli',
      },
    },
    homepage: 'https://www.moonshot.cn/',
  },
];

export function getToolDefinition(name: string): ToolDefinition | undefined {
  return TOOL_DEFINITIONS.find(tool => tool.name === name);
}
