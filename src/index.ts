import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

import type { Platform, Project, Tool } from "./parsers";
import { PlatformsParser, ProjectsParser, ToolsParser } from "./parsers";

export interface Content {
  projects: Project[];
  tools: Tool[];
  platforms: Platform[];
}

const defaultPaths = {
  content: path.resolve(process.cwd(), "content"),
  template: path.resolve(process.cwd(), "template.docx"),
  output: path.resolve(process.cwd(), "resume.docx"),
} as const;

class ContentLoader {
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

class ResumeGenerator {
  private readonly templatePath: string;
  private readonly outputPath: string;
  private readonly content: Content;

  private document!: Docxtemplater;

  constructor(templatePath: string, outputPath: string, content: Content) {
    this.templatePath = templatePath;
    this.outputPath = outputPath;
    this.content = content;
  }

  async generate(): Promise<void> {
    await this.loadTemplate();
    this.document.render(this.content);
    await this.saveDocument();
  }

  private async loadTemplate() {
    const templateBuffer = await readFile(this.templatePath);
    const zip = new PizZip(templateBuffer);

    this.document = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
  }

  private async saveDocument() {
    const output = this.document.getZip().generate({ type: "nodebuffer" });
    await writeFile(this.outputPath, output);
  }
}

async function main() {
  const content = await new ContentLoader(defaultPaths.content).load();
  await new ResumeGenerator(
    defaultPaths.template,
    defaultPaths.output,
    content,
  ).generate();
  process.stdout.write(`Generated ${path.basename(defaultPaths.output)}\n`);
}

if (require.main === module) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
