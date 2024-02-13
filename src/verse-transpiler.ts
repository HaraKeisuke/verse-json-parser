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
    `${name}_generated := struct:\n` +
    `${Object.keys(json)
      .map((key) => {
        return `\t${convertVariable(key, json[key])}`;
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
    return [convertVariable(k, value[k])];
  });

  return [
    `${key}_generated := struct:\n` +
      `${struct.map((s) => `\t${s}`).join("\n")}`,
  ];
};

const convertVariable = (key: string, value: JSON_FORMAT_VALUE): string => {
  return `${key} :${convertType(value)}= ${convertValue(key, value)}`;
};

const convertType = (value: JSON_FORMAT_VALUE): string => {
  if (typeof value === "string") {
    return "string";
  } else if (typeof value === "number") {
    if (Number.isInteger(value)) {
      return "int";
    }
    return "float";
  } else if (typeof value === "boolean") {
    return "logic";
  } else if (Array.isArray(value)) {
    return `[]${convertType(value[0])}`;
  } else {
    return "";
  }
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
      throw new Error(`Array value of ${key} contains non-primitive value.`);
    }

    if (
      value.every((v) => typeof v === "string") ||
      value.every((v) => typeof v === "number") ||
      value.every((v) => typeof v === "boolean")
    ) {
      return `array{${value
        .map((v) => (typeof v === "string" ? `"${v}"` : v))
        .join(", ")}}`;
    }

    throw new Error(`Array value of ${key} contains different type value.`);
  } else {
    throw new Error(`Unsupported value type: ${typeof value}`);
    // return `${key}_generated`;
  }
};
