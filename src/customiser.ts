import readline from "node:readline/promises";

import { Content, FilterableContent } from "./content.js";

export class ContentCustomiser {
  private readonly readline: readline.Interface;
  private content: Content;

  constructor(content: Content) {
    this.content = content;
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async customise(): Promise<Content> {
    const rejectedProjects: FilterableContent[] = [];
    for (const project of this.content.projects) {
      if (!(await this.askUserToInclude(project))) {
        rejectedProjects.push(project);
      }
    }
    this.content.projects = this.content.projects.filter(
      (project) => !rejectedProjects.includes(project),
    );
    this.readline.close();
    return this.content;
  }

  private async askUserToInclude(content: FilterableContent) {
    const name = content.title;
    const response = await this.readline.question(
      `Do you want to include the project "${name}"? (y/N): `,
    );
    return response.toLowerCase() === "y";
  }
}
