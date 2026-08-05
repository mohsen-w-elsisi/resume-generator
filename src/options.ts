import path from "node:path";

export interface ProgramOptions {
  paths: {
    content: string;
    template: string;
    output: string;
  };
  showHelp: boolean;
  addAllContent: boolean;
  addTags: string[];
}

export class OptionsParser {
  private options: ProgramOptions = {
    paths: { ...defaultPaths },
    showHelp: false,
    addAllContent: false,
    addTags: [],
  };

  private readonly argv: string[];

  constructor(argv: string[] = process.argv.slice(2)) {
    this.argv = argv;
  }

  parse(): ProgramOptions {
    for (let index = 0; index < this.argv.length; index += 1) {
      const token = this.argv[index];

      switch (token) {
        case "-o":
          this.options.paths.output = this.readPathValue("-o", index);
          index += 1;
          break;

        case "-c":
          this.options.paths.content = this.readPathValue("-c", index);
          index += 1;
          break;

        case "-x":
          this.options.paths.template = this.readPathValue("-x", index);
          index += 1;
          break;

        case "-a":
          this.options.addAllContent = true;
          break;

        case "-h":
          this.options.showHelp = true;
          break;

        case "-t":
          while (this.argv[index + 1] && !this.isFlag(this.argv[index + 1])) {
            this.options.addTags.push(this.argv[index + 1]);
            index += 1;
          }
          break;

        default:
          if (this.isFlag(token)) {
            throw new UnknownFlagError(token);
          }
      }
    }

    return this.options;
  }

  private readPathValue(flag: string, index: number): string {
    const value = this.argv[index + 1];

    if (!value || this.isFlag(value)) {
      throw new MissingValueError(flag);
    }

    return path.resolve(process.cwd(), value);
  }

  private isFlag(token: string): boolean {
    return token.startsWith("-");
  }
}

const defaultPaths = {
  content: path.resolve(process.cwd(), "content"),
  template: path.resolve(process.cwd(), "template.docx"),
  output: path.resolve(process.cwd(), "resume.docx"),
} as const;

export class UnknownFlagError extends Error {
  constructor(readonly flag: string) {
    super(`Unknown option: ${flag}`);
    this.name = "UnknownFlagError";
  }
}

export class MissingValueError extends Error {
  constructor(readonly flag: string) {
    super(`Missing value for ${flag}`);
    this.name = "MissingValueError";
  }
}
