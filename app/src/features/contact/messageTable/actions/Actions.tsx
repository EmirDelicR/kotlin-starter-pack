import { useEffect } from 'react';

import { ActionIcon, Flex, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconEye, IconTrash } from '@tabler/icons-react';

import { normalizeError } from '@/utils';

import { useDeleteMessageMutation } from '../../store/contactApiSlice';
import MessageDetails from '../details/MessageDetails';

function DeleteMessageActionIcon({ messageId }: { messageId: string }) {
  const [deleteMessage, { isError, error, isLoading }] =
    useDeleteMessageMutation();
  const { message = 'Unknown Error occurred!' } = normalizeError(error);

  const onDeleteHandler = async () => {
    await deleteMessage(messageId);
  };

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: 'Error deleting message',
        message: message,
        color: 'red'
      });
    }
  }, [isError]);

  return (
    <ActionIcon
      color="red"
      size={24}
      radius="xl"
      onClick={onDeleteHandler}
      loading={isLoading}
      data-testid="message-delete-icon"
    >
      <IconTrash size={16} />
    </ActionIcon>
  );
}

export default function Actions({
  id,
  unread
}: {
  id: string;
  unread: boolean;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Flex gap="sm">
      <DeleteMessageActionIcon messageId={id} />
      <ActionIcon
        color={unread ? 'blue' : 'green'}
        size={24}
        radius="xl"
        onClick={open}
        data-testid="message-show-icon"
      >
        <IconEye size={16} />
      </ActionIcon>
      <Modal
        title="Message details"
        opened={opened}
        onClose={close}
        centered
        size="lg"
      >
        <MessageDetails id={id} />
      </Modal>
    </Flex>
  );
}
