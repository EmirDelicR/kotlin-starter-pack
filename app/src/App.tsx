import "@mantine/core/styles.css";

import { MantineProvider, AppShell, Burger, Loader } from "@mantine/core";

import theme from "@/configs/themeConfig";
import { useDisclosure } from "@mantine/hooks";
import Header from "@/UI/elements/header/Header";
import NavBar from "@/UI/elements/navBar/NavBar";
import AuthPage from "@/UI/pages/AuthPage.tsx";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";

function App() {
  const [opened, { toggle }] = useDisclosure();
  const isLoggedIn = false;
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Suspense fallback={<Loader />}>
        {!isLoggedIn && <AuthPage />}
        {isLoggedIn && (
          <AppShell
            header={{ height: 60 }}
            navbar={{
              width: 300,
              breakpoint: "sm",
              collapsed: { mobile: !opened },
            }}
            padding="md"
          >
            <AppShell.Header p="md" display="flex">
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              <Header />
            </AppShell.Header>

            <AppShell.Navbar p="md">
              <NavBar />
            </AppShell.Navbar>

            <AppShell.Main>
              <Suspense fallback={<Loader />}>
                <Outlet />
              </Suspense>
            </AppShell.Main>
          </AppShell>
        )}
        <Outlet />
      </Suspense>
    </MantineProvider>
  );
}

export default App;
