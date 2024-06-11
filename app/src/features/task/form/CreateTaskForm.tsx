import { useEffect } from 'react';

import { Button, LoadingOverlay, Paper, TextInput } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';

import Error from '@/UI/components/error/Error';
import { useAppSelector } from '@/store';
import { selectUserId } from '@/store/userSlice';

import { Task, useAddTaskMutation } from '../store/taskApiSlice';

type TaskForm = Pick<Task, 'title'>;

const INITIAL_FORM_VALUES: TaskForm = {
  title: ''
};

interface Props {
  onSuccessCallback: () => void;
}

export default function CreateTaskForm({ onSuccessCallback }: Props) {
  const userId = useAppSelector(selectUserId);
  const [addTask, { isError, error, isSuccess, isLoading }] =
    useAddTaskMutation();
  const taskForm = useForm<TaskForm>({
    mode: 'uncontrolled',
    initialValues: INITIAL_FORM_VALUES,
    validate: {
      title: hasLength(
        { min: 2, max: 80 },
        'Task title field is required to be between 2 and 80 chars.'
      )
    }
  });

  useEffect(() => {
    if (isSuccess) {
      taskForm.reset();
      onSuccessCallback();
    }
  }, [isSuccess]);

  const handleSubmit = async (data: TaskForm) => {
    await addTask({ userId, ...data });
  };

  return (
    <Paper withBorder shadow="md" p="md" my="md" radius="md">
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'var(--mantine-color-blue-6)', type: 'bars' }}
        data-testid="create-task-loader"
      />
      <form onSubmit={taskForm.onSubmit(handleSubmit)}>
        <TextInput
          label="Enter new task"
          placeholder="Task title"
          withAsterisk
          data-testid="task-title"
          mb="md"
          key={taskForm.key('title')}
          {...taskForm.getInputProps('title')}
        />

        <Button fullWidth type="submit">
          Submit
        </Button>
      </form>
      <Error isError={isError} error={error} />
    </Paper>
  );
}
