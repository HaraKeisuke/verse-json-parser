import fs from "fs";

export const loadJson = (path: string): JSON_FORMAT => {
  try {
    return JSON.parse(fs.readFileSync(path, "utf-8"));
  } catch (e) {
    throw new Error(`Error loading json file: ${path}`);
  }
};

export type JSON_FORMAT_VALUE =
  | string
  | number
  | boolean
  | JSON_FORMAT
  | JSON_FORMAT[];

export type JSON_FORMAT = {
  [key: string]: JSON_FORMAT_VALUE;
};
