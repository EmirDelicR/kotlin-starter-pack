import { useEffect, useMemo, useState } from 'react';

import {
  ActionIcon,
  Button,
  Center,
  Group,
  List,
  Loader,
  Modal,
  Pagination,
  Paper,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconCircleCheck,
  IconCircleDashed,
  IconTrash
} from '@tabler/icons-react';

import Error from '@/UI/components/error/Error';
import { ITEMS_PER_PAGE, MOBILE } from '@/constants';
import { useAppSelector } from '@/store';
import { selectUserId } from '@/store/userSlice';
import { normalizeError } from '@/utils';

import classes from './TaskManager.module.scss';
import CreateTaskForm from './form/CreateTaskForm';
import {
  Task,
  useDeleteTaskMutation,
  useGetPaginatedTasksQuery,
  useUpdateTaskMutation
} from './store/taskApiSlice';

interface TaskItemProps {
  item: Task;
}

function UpdateTaskActionIcon({ item }: TaskItemProps) {
  const [updateTask, { isError, error, isLoading }] = useUpdateTaskMutation();
  const { message = 'Unknown Error occurred!' } = normalizeError(error);
  const icon = item.completed ? (
    <IconCircleCheck size={16} />
  ) : (
    <IconCircleDashed size={16} />
  );
  const iconColor = item.completed ? 'teal' : 'blue';

  const onUpdateHandler = async () => {
    await updateTask({ ...item, completed: !item.completed });
  };

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: 'Error updating task',
        message: message,
        color: 'red'
      });
    }
  }, [isError]);

  return (
    <ActionIcon
      color={iconColor}
      size={24}
      radius="xl"
      loading={isLoading}
      onClick={onUpdateHandler}
      data-testid="task-update-icon"
    >
      {icon}
    </ActionIcon>
  );
}

function DeleteTaskActionIcon({ item }: TaskItemProps) {
  const [deleteTask, { isError, error, isLoading }] = useDeleteTaskMutation();
  const { message = 'Unknown Error occurred!' } = normalizeError(error);

  const onDeleteHandler = async () => {
    await deleteTask({ taskId: item.id, userId: item.userId });
  };

  useEffect(() => {
    if (isError) {
      notifications.show({
        title: 'Error deleting task',
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
      data-testid="task-delete-icon"
    >
      <IconTrash size={16} />
    </ActionIcon>
  );
}

function TaskItem({ item }: TaskItemProps) {
  return (
    <List.Item
      className={classes.item}
      icon={<UpdateTaskActionIcon item={item} />}
    >
      <Group justify="space-between">
        <Text>{item.title}</Text>
        <DeleteTaskActionIcon item={item} />
      </Group>
    </List.Item>
  );
}

function TaskList() {
  const userId = useAppSelector(selectUserId);
  const [currentPage, setCurrentPage] = useState(0);
  const isMobileView = useMediaQuery(MOBILE);

  const { data, isLoading, isSuccess, isError, error } =
    useGetPaginatedTasksQuery({
      userId,
      page: currentPage,
      pageSize: ITEMS_PER_PAGE,
      isMobile: isMobileView
    });

  const content = useMemo(() => {
    if (!isSuccess) {
      return null;
    }
    const { tasks, numberOfPages } = data;

    if (tasks && tasks.length > 0) {
      return tasks.map((task: Task) => {
        return <TaskItem key={task.id} item={task} />;
      });
    }

    // This is in case that user delete last item on page
    if (tasks.length === 0 && numberOfPages > 0) {
      setCurrentPage((prev) => prev - 1);
    }

    return <Text>Currently there is no data.</Text>;
  }, [data, isSuccess]);

  if ((isLoading || !data) && !isError) {
    return (
      <Center my="lg">
        <Loader type="bars" data-testid="task-list-loader" />
      </Center>
    );
  }

  if (isError) {
    return <Error isError={isError} error={error} />;
  }

  const { numberOfPages } = data;

  const onNext = () =>
    setCurrentPage((prev) => {
      if (prev > numberOfPages - 1) {
        return prev;
      }
      return prev + 1;
    });

  return (
    <>
      <List spacing="md" size="sm">
        {content}
      </List>
      <Center mt="md">
        {isMobileView ? (
          <Button
            disabled={currentPage === numberOfPages}
            onClick={onNext}
            variant="outline"
          >
            Load more
          </Button>
        ) : (
          <Pagination
            total={numberOfPages}
            onChange={setCurrentPage}
            value={currentPage}
          />
        )}
      </Center>
    </>
  );
}

export default function TaskManager() {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <>
      <Center>
        <Stack w={800} align="stretch" gap="md">
          <Center>
            <Title order={3}>Manage tasks</Title>
          </Center>
          <Paper withBorder shadow="md" p="md">
            <TaskList />
          </Paper>
          <Button onClick={open}>Create</Button>
        </Stack>
      </Center>
      <Modal
        centered
        size="lg"
        opened={opened}
        onClose={close}
        title="Create task"
      >
        <CreateTaskForm onSuccessCallback={close} />
      </Modal>
    </>
  );
}
