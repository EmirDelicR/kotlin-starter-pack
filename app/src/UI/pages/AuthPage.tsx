import { Container, Flex, Paper } from '@mantine/core';

import Logo from '@/UI/components/logo/Logo.tsx';
import ThemeToggle from '@/UI/components/themeToggle/ThemeToggle.tsx';
import Auth from '@/features/auth/Auth.tsx';

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
