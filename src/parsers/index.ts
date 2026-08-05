export type { Parser } from './parser';
export { ProjectsParser, Project } from './projects';
export { ToolsParser, Tool } from './tools';
export { PlatformsParser, Platform } from './platforms';

export const parserNames = ['projects', 'tools', 'platforms'] as const;

export type ParserName = (typeof parserNames)[number];