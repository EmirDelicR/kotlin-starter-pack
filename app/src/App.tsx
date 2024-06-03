import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import theme from "@/configs/themeConfig";
import AppRoutes from "@/routes/Routes";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppRoutes />
      <Notifications />
    </MantineProvider>
  );
}

export default App;
