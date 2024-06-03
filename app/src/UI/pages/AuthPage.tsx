import { Container, Flex, Paper } from "@mantine/core";
import Auth from "@/features/auth/Auth.tsx";
import ThemeToggle from "@/UI/components/themeToggle/ThemeToggle.tsx";
import Logo from "@/UI/components/logo/Logo.tsx";

export default function AuthPage() {
  return (
    <Container mih="100vh" pt="10vh" size="lg">
      <Paper shadow="xs" withBorder>
        <Auth />
        <Flex align="center" justify="space-between" p="md">
          <Logo />
          <ThemeToggle />
        </Flex>
      </Paper>
    </Container>
  );
}
