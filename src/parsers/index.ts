export type { Parser } from './parser';
export { ProjectsParser } from './projects';
export { ToolsParser } from './tools';
export { PlatformsParser } from './platforms';

export const parserNames = ['projects', 'tools', 'platforms'] as const;

export type ParserName = (typeof parserNames)[number];