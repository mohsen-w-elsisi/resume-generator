#!/usr/bin/env node

import path from "node:path";

import { OptionsParser } from "./options.js";
import ResumeGenerator from "./resumeGenerator.js";
import { ContentLoader } from "./content.js";
import { ContentCustomiser } from "./customiser.js";
import showHelpMessage from "./help.js";

async function main() {
  const { paths, addTags, addAllContent, showHelp } =
    new OptionsParser().parse();

  if (showHelp) {
    await showHelpMessage();
    return;
  }

  const content = await new ContentLoader(paths.content, addTags).load();

  if (!addAllContent) await new ContentCustomiser(content).customise();

  await new ResumeGenerator(paths.template, paths.output, content).generate();

  process.stdout.write(`Generated ${path.basename(paths.output)}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
