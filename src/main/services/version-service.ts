import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';
import * as semver from 'semver';
import { VersionInfo, ToolDefinition } from '../../shared/types';

/**
 * Version Service - Queries latest versions from various sources
 */
export class VersionService {
  private octokit: Octokit;
  private cache: Map<string, { version: VersionInfo; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  constructor(githubToken?: string) {
    this.octokit = new Octokit({
      auth: githubToken,
    });
  }

  /**
   * Get latest version for a tool
   */
  async getLatestVersion(definition: ToolDefinition): Promise<VersionInfo | null> {
    // Check cache first
    const cached = this.cache.get(definition.name);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.version;
    }

    try {
      let versionInfo: VersionInfo | null = null;

      // Try GitHub first if available
      if (definition.installMethods.github) {
        versionInfo = await this.getGitHubVersion(definition);
      }

      // Fallback to npm
      if (!versionInfo && definition.installMethods.npm) {
        versionInfo = await this.getNpmVersion(definition.installMethods.npm);
      }

      // Fallback to PyPI
      if (!versionInfo && definition.installMethods.pip) {
        versionInfo = await this.getPyPiVersion(definition.installMethods.pip);
      }

      // Fallback to Homebrew
      if (!versionInfo && definition.installMethods.brew) {
        versionInfo = await this.getBrewVersion(definition.installMethods.brew);
      }

      // Cache the result
      if (versionInfo) {
        this.cache.set(definition.name, {
          version: versionInfo,
          timestamp: Date.now(),
        });
      }

      return versionInfo;
    } catch (error) {
      console.error(`Error fetching version for ${definition.name}:`, error);
      return null;
    }
  }

  /**
   * Get version from GitHub Releases
   */
  private async getGitHubVersion(definition: ToolDefinition): Promise<VersionInfo | null> {
    if (!definition.installMethods.github) {
      return null;
    }

    try {
      const { owner, repo } = definition.installMethods.github;
      const { data } = await this.octokit.repos.getLatestRelease({
        owner,
        repo,
      });

      return {
        version: data.tag_name.replace(/^v/, ''),
        publishedAt: new Date(data.published_at || data.created_at),
        downloadUrl: data.assets[0]?.browser_download_url,
        changelog: data.body || undefined,
      };
    } catch (error) {
      // If no releases, try tags
      try {
        const { owner, repo } = definition.installMethods.github;
        const { data } = await this.octokit.repos.listTags({
          owner,
          repo,
          per_page: 1,
        });

        if (data.length > 0) {
          return {
            version: data[0].name.replace(/^v/, ''),
            publishedAt: new Date(),
          };
        }
      } catch {
        // Ignore
      }

      return null;
    }
  }

  /**
   * Get version from npm registry
   */
  private async getNpmVersion(packageName: string): Promise<VersionInfo | null> {
    try {
      const response = await fetch(`https://registry.npmjs.org/${packageName}`);
      if (!response.ok) {
        return null;
      }

      const data = await response.json() as any;
      const latestVersion = data['dist-tags']?.latest;

      if (!latestVersion) {
        return null;
      }

      const versionData = data.versions[latestVersion];

      return {
        version: latestVersion,
        publishedAt: new Date(data.time[latestVersion]),
        changelog: versionData?.description,
      };
    } catch {
      return null;
    }
  }

  /**
   * Get version from PyPI
   */
  private async getPyPiVersion(packageName: string): Promise<VersionInfo | null> {
    try {
      const response = await fetch(`https://pypi.org/pypi/${packageName}/json`);
      if (!response.ok) {
        return null;
      }

      const data = await response.json() as any;
      const version = data.info.version;

      return {
        version,
        publishedAt: new Date(data.releases[version]?.[0]?.upload_time || Date.now()),
      };
    } catch {
      return null;
    }
  }

  /**
   * Get version from Homebrew
   */
  private async getBrewVersion(formulaName: string): Promise<VersionInfo | null> {
    try {
      const response = await fetch(
        `https://formulae.brew.sh/api/formula/${formulaName}.json`
      );
      if (!response.ok) {
        return null;
      }

      const data = await response.json() as any;
      const version = data.versions?.stable;

      if (!version) {
        return null;
      }

      return {
        version,
        publishedAt: new Date(),
      };
    } catch {
      return null;
    }
  }

  /**
   * Compare two versions
   */
  isNewer(current: string, latest: string): boolean {
    try {
      return semver.gt(latest, current);
    } catch {
      // Fallback to string comparison if not valid semver
      return latest > current;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}
