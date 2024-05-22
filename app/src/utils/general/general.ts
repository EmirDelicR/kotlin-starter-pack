export const classNameHelper = (...args: string[]): string => {
  const classes = args.filter((entry) => entry && entry.trim() !== "");
  return classes.toString().replaceAll(",", " ").trim();
};
