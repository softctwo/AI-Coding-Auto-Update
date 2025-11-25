import { Octokit } from '@octokit/rest';
import * as semver from 'semver';
import { VersionInfo, ToolDefinition } from '../../shared/types';

/**
 * Version Service - Queries latest versions from various sources
 * Priority: npm > pip > brew > GitHub (GitHub is last due to rate limiting without token)
 */
export class VersionService {
  private octokit: Octokit | null = null;
  private cache: Map<string, { version: VersionInfo; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly REQUEST_TIMEOUT = 10000; // 10 seconds

  constructor(githubToken?: string) {
    try {
      this.octokit = new Octokit({
        auth: githubToken,
      });
    } catch (error) {
      console.error('Failed to initialize Octokit:', error);
      this.octokit = null;
    }
  }

  /**
   * Get latest version for a tool
   * Uses npm/pip/brew first (more reliable), GitHub as fallback
   */
  async getLatestVersion(definition: ToolDefinition): Promise<VersionInfo | null> {
    // Check cache first
    const cached = this.cache.get(definition.name);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log(`[VersionService] Cache hit for ${definition.name}: ${cached.version.version}`);
      return cached.version;
    }

    console.log(`[VersionService] Fetching version for ${definition.name}...`);

    let versionInfo: VersionInfo | null = null;

    // Try npm first (most reliable for JS tools)
    if (!versionInfo && definition.installMethods.npm) {
      console.log(`[VersionService] Trying npm for ${definition.name}...`);
      versionInfo = await this.getNpmVersion(definition.installMethods.npm);
      if (versionInfo) {
        console.log(`[VersionService] Found npm version for ${definition.name}: ${versionInfo.version}`);
      }
    }

    // Fallback to PyPI
    if (!versionInfo && definition.installMethods.pip) {
      console.log(`[VersionService] Trying PyPI for ${definition.name}...`);
      versionInfo = await this.getPyPiVersion(definition.installMethods.pip);
      if (versionInfo) {
        console.log(`[VersionService] Found PyPI version for ${definition.name}: ${versionInfo.version}`);
      }
    }

    // Fallback to Homebrew
    if (!versionInfo && definition.installMethods.brew) {
      console.log(`[VersionService] Trying Homebrew for ${definition.name}...`);
      versionInfo = await this.getBrewVersion(definition.installMethods.brew);
      if (versionInfo) {
        console.log(`[VersionService] Found Homebrew version for ${definition.name}: ${versionInfo.version}`);
      }
    }

    // Try GitHub last (may be rate-limited without token)
    if (!versionInfo && definition.installMethods.github) {
      console.log(`[VersionService] Trying GitHub for ${definition.name}...`);
      versionInfo = await this.getGitHubVersion(definition);
      if (versionInfo) {
        console.log(`[VersionService] Found GitHub version for ${definition.name}: ${versionInfo.version}`);
      }
    }

    // Cache the result
    if (versionInfo) {
      this.cache.set(definition.name, {
        version: versionInfo,
        timestamp: Date.now(),
      });
    } else {
      console.warn(`[VersionService] No version found for ${definition.name}`);
    }

    return versionInfo;
  }

  /**
   * Get version from GitHub Releases
   */
  private async getGitHubVersion(definition: ToolDefinition): Promise<VersionInfo | null> {
    if (!definition.installMethods.github || !this.octokit) {
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
      const fetchModule = await import('node-fetch');
      const fetchFn = fetchModule.default || (fetchModule as unknown as typeof import('node-fetch').default);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);
      
      try {
        const response = await fetchFn(`https://registry.npmjs.org/${packageName}`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.warn(`[VersionService] npm registry returned ${response.status} for ${packageName}`);
          return null;
        }

        const data = await response.json() as Record<string, unknown>;
        const distTags = data['dist-tags'] as Record<string, string> | undefined;
        const latestVersion = distTags?.latest;

        if (!latestVersion) {
          console.warn(`[VersionService] No latest version found in npm for ${packageName}`);
          return null;
        }

        const versions = data.versions as Record<string, Record<string, unknown>> | undefined;
        const time = data.time as Record<string, string> | undefined;
        const versionData = versions?.[latestVersion];

        return {
          version: latestVersion,
          publishedAt: time?.[latestVersion] ? new Date(time[latestVersion]) : new Date(),
          changelog: versionData?.description as string | undefined,
        };
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(`[VersionService] npm request timed out for ${packageName}`);
      } else {
        console.warn(`[VersionService] npm request failed for ${packageName}:`, error);
      }
      return null;
    }
  }

  /**
   * Get version from PyPI
   */
  private async getPyPiVersion(packageName: string): Promise<VersionInfo | null> {
    try {
      const fetchModule = await import('node-fetch');
      const fetchFn = fetchModule.default || (fetchModule as unknown as typeof import('node-fetch').default);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);
      
      try {
        const response = await fetchFn(`https://pypi.org/pypi/${packageName}/json`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.warn(`[VersionService] PyPI returned ${response.status} for ${packageName}`);
          return null;
        }

        const data = await response.json() as Record<string, unknown>;
        const info = data.info as Record<string, unknown> | undefined;
        const version = info?.version as string | undefined;

        if (!version) {
          console.warn(`[VersionService] No version found in PyPI for ${packageName}`);
          return null;
        }

        const releases = data.releases as Record<string, Array<Record<string, unknown>>> | undefined;
        const releaseInfo = releases?.[version]?.[0];

        return {
          version,
          publishedAt: releaseInfo?.upload_time 
            ? new Date(releaseInfo.upload_time as string) 
            : new Date(),
        };
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(`[VersionService] PyPI request timed out for ${packageName}`);
      } else {
        console.warn(`[VersionService] PyPI request failed for ${packageName}:`, error);
      }
      return null;
    }
  }

  /**
   * Get version from Homebrew
   */
  private async getBrewVersion(formulaName: string): Promise<VersionInfo | null> {
    try {
      const fetchModule = await import('node-fetch');
      const fetchFn = fetchModule.default || (fetchModule as unknown as typeof import('node-fetch').default);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);
      
      try {
        const response = await fetchFn(
          `https://formulae.brew.sh/api/formula/${formulaName}.json`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.warn(`[VersionService] Homebrew returned ${response.status} for ${formulaName}`);
          return null;
        }

        const data = await response.json() as Record<string, unknown>;
        const versions = data.versions as Record<string, string> | undefined;
        const version = versions?.stable;

        if (!version) {
          console.warn(`[VersionService] No stable version found in Homebrew for ${formulaName}`);
          return null;
        }

        return {
          version,
          publishedAt: new Date(),
        };
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(`[VersionService] Homebrew request timed out for ${formulaName}`);
      } else {
        console.warn(`[VersionService] Homebrew request failed for ${formulaName}:`, error);
      }
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
