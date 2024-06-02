import {
  ActionIcon,
  Button,
  Center,
  Group,
  List,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconCircleCheck,
  IconCircleDashed,
  IconTrash,
} from "@tabler/icons-react";

import classes from "./TaskManager.module.scss";
import { useDisclosure } from "@mantine/hooks";

interface Item {
  id: String;
  title: String;
  completed: Boolean;
  userId: String;
  createdAt: Date;
}

const ItemList: Item[] = [
  {
    id: "1",
    title: "Task 1",
    completed: true,
    userId: "1",
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Task 2",
    completed: false,
    userId: "1",
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Task 3",
    completed: true,
    userId: "1",
    createdAt: new Date(),
  },
  {
    id: "4",
    title: "Task 4",
    completed: true,
    userId: "1",
    createdAt: new Date(),
  },
];

function CreateTaskForm() {
  return <div>Task form</div>;
  // const userId = useAppSelector(selectUserId);
  // const [addTask, { isError, error, isSuccess }] = useAddTaskMutation();
  // const { handleSubmit, control, resetField } = useForm<TaskForm>({
  //   defaultValues: {
  //     title: ''
  //   },
  //   mode: 'onChange'
  // });

  // useEffect(() => {
  //   if (isSuccess) {
  //     resetField('title');
  //   }
  // }, [isSuccess]);

  // const onSubmit = async (data: TaskForm) => {
  //   await addTask({ userId, title: data.title });
  // };

  // return (
  //   <form onSubmit={handleSubmit(onSubmit)} className={classes.form} noValidate>
  //     <Input
  //       label="Enter new task"
  //       name={'title'}
  //       type="text"
  //       data-testid="task-title"
  //       control={control}
  //       withAsterisk
  //       useValidator={false}
  //       rules={{
  //         required: 'Task title field is required.',
  //         maxLength: { value: 80, message: 'Task title is to long' }
  //       }}
  //     />
  //     <Error isError={isError} error={error} />
  //     <Button size="large" type="submit" className="submit">
  //       Submit
  //     </Button>
  //   </form>
  // );
}

interface ItemProps {
  item: Item;
}

function Item({ item }: ItemProps) {
  const icon = item.completed ? (
    <IconCircleCheck size={16} />
  ) : (
    <IconCircleDashed size={16} />
  );

  const iconColor = item.completed ? "teal" : "blue";

  return (
    <List.Item
      className={classes.item}
      icon={
        <ActionIcon color={iconColor} size={24} radius="xl">
          {icon}
        </ActionIcon>
      }
    >
      <Group justify="space-between">
        <Text>{item.title}</Text>
        {/* // loading={true} */}
        <ActionIcon color="red" size={24} radius="xl">
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
    </List.Item>
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
            <List spacing="md" size="sm">
              {ItemList.map((item) => (
                <Item item={item} />
              ))}
            </List>
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
        <CreateTaskForm />
      </Modal>
    </>
  );
}
