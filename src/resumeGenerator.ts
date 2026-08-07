import Docxtemplater from "docxtemplater";
import { readFile, writeFile } from "fs/promises";
import PizZip from "pizzip";
import { Content } from "./content.js";

export default class ResumeGenerator {
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
