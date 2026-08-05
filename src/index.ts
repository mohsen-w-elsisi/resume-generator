import path from "node:path";

import { OptionsParser } from "./options";
import ResumeGenerator from "./resumeGenerator";
import { ContentLoader } from "./content";

async function main() {
  const { paths } = new OptionsParser().parse();
  const content = await new ContentLoader(paths.content).load();
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
