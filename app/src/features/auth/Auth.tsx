import { Tabs } from "@mantine/core";
import Login from "./login/Login.tsx";
import Register from "./register/Register.tsx";
import { IconLogin, IconUser } from "@tabler/icons-react";

export default function Auth() {
  return (
    <Tabs variant="outline" defaultValue="login">
      <Tabs.List grow justify="center">
        <Tabs.Tab
          value="login"
          leftSection={<IconLogin style={{ stroke: "orange" }} />}
        >
          Login
        </Tabs.Tab>
        <Tabs.Tab
          value="register"
          leftSection={<IconUser style={{ stroke: "orange" }} />}
        >
          Register
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="login" pt="xs">
        <Login />
      </Tabs.Panel>
      <Tabs.Panel value="register" pt="xs">
        <Register />
      </Tabs.Panel>
    </Tabs>
  );
}
