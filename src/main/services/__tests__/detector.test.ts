import { ToolDetector } from '../detector';
import { getToolDefinition } from '../../../shared/tool-definitions';

describe('ToolDetector', () => {
  let detector: ToolDetector;

  beforeEach(() => {
    detector = new ToolDetector();
  });

  describe('scanAllTools', () => {
    it('should scan and return tool information', async () => {
      const tools = await detector.scanAllTools();

      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBeGreaterThan(0);

      // Each tool should have required properties
      tools.forEach(tool => {
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('displayName');
        expect(tool).toHaveProperty('status');
        expect(tool).toHaveProperty('installMethod');
      });
    });
  });

  describe('detectTool', () => {
    it('should detect an installed tool', async () => {
      // Test with a common tool like Node.js
      const nodeDef = {
        name: 'node',
        displayName: 'Node.js',
        command: 'node',
        versionFlag: '--version',
        versionRegex: /v(\d+\.\d+\.\d+)/,
        installMethods: {},
      };

      const result = await detector.detectTool(nodeDef);

      // Node should be installed in test environment
      expect(result.name).toBe('node');
      expect(result.currentVersion).toBeTruthy();
    });

    it('should handle non-existent tools', async () => {
      const fakeDef = {
        name: 'nonexistent-tool-xyz',
        displayName: 'Fake Tool',
        command: 'nonexistent-tool-xyz',
        versionFlag: '--version',
        versionRegex: /(\d+\.\d+\.\d+)/,
        installMethods: {},
      };

      const result = await detector.detectTool(fakeDef);

      expect(result.status).toBe('not-installed');
      expect(result.currentVersion).toBeNull();
    });
  });
});
