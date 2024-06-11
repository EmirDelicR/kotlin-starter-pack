import { Avatar, Button, Group, Modal, Paper, Text, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout, IconUser } from '@tabler/icons-react';

import useLogout from '@/hooks/useLogout';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/userSlice';

import EditProfileForm from '../edit/EditProfileForm';

export default function MinimalDetails() {
  const user = useAppSelector(selectUser);
  const [opened, { open, close }] = useDisclosure(false);
  const onUserLogoutHandler = useLogout();

  return (
    <>
      <Paper radius="md" withBorder p="md">
        <Avatar src={user.avatar} size={120} radius={120} mx="auto" />
        <Text ta="center" fz="lg" fw={500} mt="md">
          {user.firstName} {user.lastName}
        </Text>
        <Text ta="center" c="dimmed" fz="sm">
          {user.email}
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
        <EditProfileForm onSuccessCallback={close} />
      </Modal>
    </>
  );
}
