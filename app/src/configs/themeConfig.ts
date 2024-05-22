import { createTheme, rem } from "@mantine/core";

export default createTheme({
  colors: {
    // or replace default theme color
    blue: [
      "#ebefff",
      "#d5dafc",
      "#a9b1f1",
      "#7b87e9",
      "#5362e1",
      "#3a4bdd",
      "#2d3fdc",
      "#1f32c4",
      "#182cb0",
      "#0b259c",
    ],
  },

  headings: {
    fontFamily: "Roboto, sans-serif",
    sizes: {
      h1: { fontSize: rem(36) },
    },
  },
});
