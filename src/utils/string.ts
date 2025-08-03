export const trim = (str: string) => {
  return str.replace(/\s/g, "");
};

export const parseInt = (str: string) => {
  try {
    return JSON.parse(str);
  } catch {
    throw Error("Invalid param");
  }
};
