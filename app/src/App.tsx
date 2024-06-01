import { MantineProvider } from "@mantine/core";

import theme from "@/configs/themeConfig";

import "@mantine/core/styles.css";
import AppRoutes from "./routes/Routes";

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppRoutes />
    </MantineProvider>
  );
}

export default App;
