import { JSON_FORMAT, JSON_FORMAT_VALUE } from "./json-loader";

export const transpileVerse = (name: string, json: JSON_FORMAT): string => {
  const structs = Object.keys(json)
    .filter((key) => typeof json[key] === "object")
    .map((key) => {
      return convertNestStruct(key, json[key]);
    })
    .flat();

  return (
    `${structs.map((s) => s).join("\n")}\n\n` +
    `${name}_generated := struct =\n` +
    `${Object.keys(json)
      .map((key) => {
        return `\t${key} := ${convertValue(key, json[key])};`;
      })
      .join("\n")}`
  );
};

const convertNestStruct = (
  key: string,
  value: JSON_FORMAT_VALUE,
  parent: string[] = []
): string[] => {
  if (typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  if (Object.keys(value).some((k) => typeof value[k] === "object")) {
    throw new Error("Nested struct is not supported.");
  }

  const struct = Object.keys(value).map((k) => {
    return [`${k} := ${convertValue(k, value[k])};`];
  });

  return [`${key} := struct =\n` + `${struct.map((s) => `\t${s}`).join("\n")}`];
};

const convertValue = (
  key: string,
  value: JSON_FORMAT_VALUE
): string | number | boolean => {
  if (typeof value === "string") {
    return `"${value}"`;
  } else if (typeof value === "number" || typeof value === "boolean") {
    return value;
  } else if (Array.isArray(value)) {
    if (
      value.some(
        (v) =>
          typeof v !== "string" &&
          typeof v !== "number" &&
          typeof v !== "boolean"
      )
    ) {
      console.log(value);
      throw new Error(`Array value of ${key} contains non-primitive value.`);
    }

    return `array{${value.map((v) => v).join(", ")}}`;
  } else {
    return key;
  }
};
