import { Avatar, Button, Group, Modal, Paper, Text, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLogout, IconUser } from "@tabler/icons-react";

import EditProfileForm from "../edit/EditProfileForm";
import useLogout from "@/hooks/useLogout";

export default function ProfileDetails() {
  const [opened, { open, close }] = useDisclosure(false);
  const onUserLogoutHandler = useLogout();

  return (
    <>
      <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
          size={120}
          radius={120}
          mx="auto"
        />
        <Text ta="center" fz="lg" fw={500} mt="md">
          Jane Fingerlicker
        </Text>
        <Text ta="center" c="dimmed" fz="sm">
          jfingerlicker@me.io • Art director
        </Text>

        <Group grow>
          <Button
            onClick={open}
            mt="md"
            leftSection={
              <IconUser style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Edit Profile
          </Button>
          <Button
            variant="default"
            mt="md"
            leftSection={
              <IconLogout style={{ width: rem(14), height: rem(14) }} />
            }
            onClick={onUserLogoutHandler}
          >
            Logout
          </Button>
        </Group>
      </Paper>
      <Modal
        opened={opened}
        centered
        onClose={close}
        title="Edit Profile"
        size="xl"
      >
        <EditProfileForm />
      </Modal>
    </>
  );
}
