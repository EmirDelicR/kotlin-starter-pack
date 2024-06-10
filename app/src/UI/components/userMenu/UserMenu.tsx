import { forwardRef } from "react";
import {
  Flex,
  Group,
  Avatar,
  Text,
  Menu,
  UnstyledButton,
  rem,
  Modal,
} from "@mantine/core";
import {
  IconSettings,
  IconLogout,
  IconChevronDown,
  IconTool,
} from "@tabler/icons-react";
import { NavLink } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";

import { useAppSelector } from "@/store";
import { selectUser } from "@/store/userSlice";

import { NavRouteNames, NavRoutes } from "@/constants";

import EditProfileForm from "@/features/profile/edit/EditProfileForm";
import useLogout from "@/hooks/useLogout";

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, name, email, icon, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      style={{
        padding: "var(--mantine-spacing-md)",
        color: "var(--mantine-color-text)",
        borderRadius: "var(--mantine-radius-sm)",
      }}
      {...others}
      data-testid="user-menu-button"
    >
      <Group>
        <Avatar src={image} radius="xl" />

        <Flex direction="column" visibleFrom="sm">
          <Text size="sm" fw={500}>
            {name}
          </Text>

          <Text c="dimmed" size="xs">
            {email}
          </Text>
        </Flex>

        {icon || <IconChevronDown size="1rem" />}
      </Group>
    </UnstyledButton>
  )
);

function LogoutItem() {
  const onUserLogoutHandler = useLogout();

  return (
    <Menu.Item
      color="red"
      leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
      onClick={onUserLogoutHandler}
      data-testid="user-menu-logout-button"
    >
      Logout
    </Menu.Item>
  );
}

export default function UserMenu() {
  const user = useAppSelector(selectUser);
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Menu withArrow shadow="md" width={200}>
        <Menu.Target>
          <UserButton
            image={user.avatar}
            name={`${user.firstName} ${user.lastName}`}
            email={user.email}
          />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Application</Menu.Label>
          <Menu.Item
            leftSection={
              <IconSettings style={{ width: rem(14), height: rem(14) }} />
            }
            onClick={open}
            data-testid="user-menu-update-button"
          >
            Edit Profile
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconTool style={{ width: rem(14), height: rem(14) }} />
            }
          >
            <NavLink
              to={NavRoutes.WORK}
              end
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {NavRouteNames.WORK}
            </NavLink>
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Danger zone</Menu.Label>
          <LogoutItem />
        </Menu.Dropdown>
      </Menu>
      <Modal
        opened={opened}
        centered
        onClose={close}
        title="Edit Profile"
        size="xl"
      >
        <EditProfileForm onSuccessCallback={close} />
      </Modal>
    </>
  );
}
