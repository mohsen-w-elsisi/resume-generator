import path from "node:path";

import { describe, expect, it } from "vitest";

import { MissingValueError, OptionsParser } from "@src/options.js";

describe("OptionsParser", () => {
  it("uses the defaults when no arguments are provided", () => {
    expect(new OptionsParser([]).parse()).toEqual(defaultOptions);
  });

  it("parses the path and boolean flags", () => {
    const options = new OptionsParser([
      "-o",
      "custom resume.docx",
      "-c",
      "custom-content",
      "-x",
      "custom-template.docx",
      "-a",
      "-h",
    ]).parse();
  
    expect(options).toEqual({
      paths: {
        content: path.resolve(process.cwd(), "custom-content"),
        template: path.resolve(process.cwd(), "custom-template.docx"),
        output: path.resolve(process.cwd(), "custom resume.docx"),
      },
      showHelp: true,
      addAllContent: true,
      addTags: [],
    });
  });

  it("collects tags after the tag flag", () => {
    expect(new OptionsParser(["-t", "webdev", "flutter"]).parse()).toEqual({
      ...defaultOptions,
      addTags: ["webdev", "flutter"],
    });
  });

  it("stops collecting tags when the next flag starts", () => {
    expect(new OptionsParser(["-t", "webdev", "-a"]).parse()).toEqual({
      ...defaultOptions,
      addAllContent: true,
      addTags: ["webdev"],
    });
  });

  it("rejects missing values for path flags", () => {
    expect(() => new OptionsParser(["-o"]).parse()).toThrow(MissingValueError);
  });
});

const defaultOptions = {
  paths: {
    content: path.resolve(process.cwd(), "content"),
    template: path.resolve(process.cwd(), "template.docx"),
    output: path.resolve(process.cwd(), "resume.docx"),
  },
  showHelp: false,
  addAllContent: false,
  addTags: [],
} as const;
