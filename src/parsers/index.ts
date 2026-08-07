export type { Parser } from './parser.js';
export { ProjectsParser, Project } from './projects.js';
export { ToolsParser, Tool } from './tools.js';
export { PlatformsParser, Platform } from './platforms.js';

export const parserNames = ['projects', 'tools', 'platforms'] as const;

export type ParserName = (typeof parserNames)[number];