import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AppShell, Burger, Center, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import Header from '../header/Header';
import NavBar from '../navBar/NavBar';

export default function AppLayout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <AppShell.Header p="md" display="flex">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Header />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavBar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Suspense
          fallback={
            <Center mih="90vh">
              <Loader type="bars" />
            </Center>
          }
        >
          <Outlet />
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
}
