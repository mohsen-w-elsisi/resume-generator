import path from "path";
import type { Project, Tool, Platform } from "@mohsen-w-elsisi/content-parsers";
import {
  ProjectsParser,
  ToolsParser,
  PlatformsParser,
} from "@mohsen-w-elsisi/content-parsers";

export interface Content {
  projects: Project[];
  tools: Tool[];
  platforms: Platform[];
}

export type TaggableContent = { tags: string[] };

export type FilterableContent = Project;

export class ContentLoader {
  private readonly tags: string[];

  private readonly parsers: {
    projects: ProjectsParser;
    tools: ToolsParser;
    platforms: PlatformsParser;
  };

  private content!: Content;

  constructor(contentRoot: string, tags: string[]) {
    this.tags = tags;

    const contentPaths = {
      projects: path.join(contentRoot, "projects"),
      tools: path.join(contentRoot, "tools"),
      platforms: path.join(contentRoot, "platforms"),
    };

    this.parsers = {
      projects: new ProjectsParser(contentPaths.projects),
      tools: new ToolsParser(contentPaths.tools),
      platforms: new PlatformsParser(contentPaths.platforms),
    };
  }

  async load(): Promise<Content> {
    const [projects, tools, platforms] = await Promise.all([
      this.parsers.projects.parse(),
      this.parsers.tools.parse(),
      this.parsers.platforms.parse(),
    ]);
    this.content = { projects, tools, platforms };
    this.filterContent();
    return this.content;
  }

  private filterContent() {
    if (this.tags.length == 0) return;

    const hasMatchingTag = (<T extends TaggableContent>(entry: T) => {
      for (const tag of entry.tags) {
        if (this.tags.includes(tag)) return true;
      }
      return false;
    }).bind(this);

    this.content.projects = this.content.projects.filter(hasMatchingTag);
  }
}
