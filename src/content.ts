import path from "path";
import type { Project, Tool, Platform } from "./parsers";
import { ProjectsParser, ToolsParser, PlatformsParser } from "./parsers";

export interface Content {
  projects: Project[];
  tools: Tool[];
  platforms: Platform[];
}

export class ContentLoader {
  private readonly parsers: {
    projects: ProjectsParser;
    tools: ToolsParser;
    platforms: PlatformsParser;
  };

  constructor(contentRoot: string) {
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
    return { projects, tools, platforms };
  }
}
