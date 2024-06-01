import { Flex, Stack } from "@mantine/core";
import ThemeToggle from "@/UI/components/themeToggle/ThemeToggle.tsx";
import Logo from "@/UI/components/logo/Logo.tsx";

import classes from "./NavBar.module.scss";
import { CSSProperties, useState } from "react";
import { classNameHelper } from "@/utils";
import { NavRouteNames, NavRoutes } from "@/constants/enums.ts";
import { NavLink } from "react-router-dom";

const links = [
  { name: NavRouteNames.HOME, link: NavRoutes.HOME },
  { name: NavRouteNames.WORK, link: NavRoutes.WORK },
  { name: NavRouteNames.EMAILS, link: NavRoutes.EMAILS },
];

export default function NavBar() {
  const [active, setActive] = useState(0);

  const items = links.map((item, index) => (
    <NavLink
      key={item.name}
      className={classNameHelper(
        classes.link,
        active === index ? classes.linkActive : ""
      )}
      to={item.link}
      onClick={() => setActive(index)}
    >
      <span data-hover={item.name}>{item.name}</span>
    </NavLink>
  ));

  return (
    <Flex direction="column" justify="space-between" flex={1} pr="lg">
      <Stack
        className={classes.container}
        py="md"
        gap="0"
        style={
          {
            "--indicator-position": `${active}`,
          } as CSSProperties
        }
      >
        {items}
      </Stack>
      <Flex align="center" justify="space-between" p="md">
        <ThemeToggle />
        <Logo hiddenFrom="sm" />
      </Flex>
    </Flex>
  );
}
