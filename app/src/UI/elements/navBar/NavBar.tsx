import { Flex, Stack } from "@mantine/core";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { useAppSelector } from "@/store";
import { selectIsUserAdmin } from "@/store/userSlice";

import ThemeToggle from "@/UI/components/themeToggle/ThemeToggle.tsx";
import Logo from "@/UI/components/logo/Logo.tsx";

import { classNameHelper } from "@/utils";
import { NavRouteNames, NavRoutes } from "@/constants/enums.ts";

import classes from "./NavBar.module.scss";

const NAV_ITEMS = {
  loginItems: [
    { name: NavRouteNames.HOME, link: NavRoutes.HOME },
    { link: NavRoutes.WORK, name: NavRouteNames.WORK },
    { link: NavRoutes.PROFILE, name: NavRouteNames.PROFILE },
  ],
  adminItems: [{ link: NavRoutes.EMAILS, name: NavRouteNames.EMAILS }],
};

export default function NavBar() {
  const [active, setActive] = useState(0);
  const location = useLocation();
  const isAdminUser = useAppSelector(selectIsUserAdmin);

  let navItems = useMemo(() => {
    return isAdminUser
      ? [...NAV_ITEMS.loginItems, ...NAV_ITEMS.adminItems]
      : NAV_ITEMS.loginItems;
  }, [isAdminUser]);

  useEffect(() => {
    setActive(
      navItems.findIndex((item) => `/${item.link}` === location.pathname)
    );
  }, []);

  const items = navItems.map((item, index) => (
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
