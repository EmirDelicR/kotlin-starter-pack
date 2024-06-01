import { useMantineColorScheme } from "@mantine/core";

import { classNameHelper } from "@/utils";

import classes from "./ThemeToggle.module.scss";

export default function ThemeToggle() {
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();
  const isDarkTheme = colorScheme === "dark";

  return (
    <div className={classes.toggle}>
      <input
        className={classes["toggle-input"]}
        type="checkbox"
        checked={isDarkTheme}
        aria-checked={isDarkTheme}
        onChange={toggleColorScheme}
      />
      <div className={classes["toggle-bg"]}></div>
      <div
        className={classNameHelper(
          classes["toggle-item-wrapper"],
          isDarkTheme ? classes.effect : ""
        )}
      >
        <div className={classes["toggle-switch-sun"]}>
          <div className={classes["toggle-switch-cloud"]}></div>
        </div>
        <div className={classes["toggle-switch-moon"]}>
          <div className={classes["toggle-switch-stars"]}></div>
        </div>
      </div>
    </div>
  );
}
