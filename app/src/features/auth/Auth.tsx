import { Tabs } from "@mantine/core";
import { IconLogin, IconUser } from "@tabler/icons-react";

import LoginForm from "./login/LoginForm.tsx";
import RegisterForm from "./register/RegisterForm.tsx";

export default function Auth() {
  return (
    <Tabs variant="outline" defaultValue="login" keepMounted={false}>
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
        <LoginForm />
      </Tabs.Panel>
      <Tabs.Panel value="register" pt="xs">
        <RegisterForm />
      </Tabs.Panel>
    </Tabs>
  );
}
