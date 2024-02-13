import path from "path";
import { loadJson } from "./src/json-loader";
import { transpileVerse } from "./src/verse-transpiler";
import { writeFileSync } from "fs";

const samplePath = path.join(__dirname, "example/hoge.json");

const main = () => {
  const json = loadJson(samplePath);
  const fileName = path.basename(samplePath, ".json");
  const verse = transpileVerse(fileName, json);
  console.log(verse);

  writeFileSync(
    path.join(__dirname, "output", `${fileName}.generated.verse`),
    verse,
    "utf-8"
  );
};

main();
