import path from "node:path";

import { OptionsParser } from "./options";
import ResumeGenerator from "./resumeGenerator";
import { ContentLoader } from "./content";
import { ContentCustomiser } from "./customiser";

async function main() {
  const { paths, addTags, addAllContent } = new OptionsParser().parse();

  let content = await new ContentLoader(
    paths.content,
    addAllContent ? undefined : addTags,
  ).load();

  if (addTags.length == 0 && !addAllContent) {
    content = await new ContentCustomiser(content).customise();
  }

  await new ResumeGenerator(paths.template, paths.output, content).generate();

  process.stdout.write(`Generated ${path.basename(paths.output)}\n`);
}

if (require.main === module) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
