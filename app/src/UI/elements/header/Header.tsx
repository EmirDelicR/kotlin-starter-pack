import { Box, Flex } from '@mantine/core';

import Logo from '@/UI/components/logo/Logo';
import UserMenu from '@/UI/components/userMenu/UserMenu';

export default function Header() {
  return (
    <Flex
      px="md"
      align="center"
      justify="space-between"
      w="100%"
      lh="1rem"
      mah="10vh"
    >
      <Box>
        <Logo visibleFrom="sm" />
      </Box>
      <Box>
        <UserMenu />
      </Box>
    </Flex>
  );
}
