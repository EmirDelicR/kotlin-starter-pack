import Logo from "@/UI/components/logo/Logo";
import ThemeToggle from "@/UI/components/themeToggle/ThemeToggle";
import { Flex } from "@mantine/core";

export default function NavFooter() {
  return (
    <Flex align="center" justify="space-between">
      <ThemeToggle />
      <Logo hiddenFrom="sm" />
    </Flex>
  );
}
