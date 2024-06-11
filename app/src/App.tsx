import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

import theme from '@/configs/themeConfig';
import AppRoutes from '@/routes/Routes';

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppRoutes />
      <Notifications />
    </MantineProvider>
  );
}

export default App;
