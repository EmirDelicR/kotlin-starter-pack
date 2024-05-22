import "@mantine/core/styles.css";

import { MantineProvider, AppShell, Burger } from "@mantine/core";

import theme from "@/configs/themeConfig";
import { useDisclosure } from "@mantine/hooks";
import Header from "@/UI/elements/header/Header";
import NavBar from "@/UI/elements/navBar/NavBar";

function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
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
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Header />
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <NavBar />
        </AppShell.Navbar>

        <AppShell.Main>Data</AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
