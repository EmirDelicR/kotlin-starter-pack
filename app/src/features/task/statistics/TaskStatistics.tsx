import {
  ThemeIcon,
  Progress,
  Text,
  Group,
  Badge,
  Paper,
  rem,
  Loader,
  Center,
} from "@mantine/core";
import { IconTools } from "@tabler/icons-react";

import classes from "./TaskStatistics.module.scss";
import { useGetTasksStatisticsQuery } from "../store/taskApiSlice";
import { useAppSelector } from "@/store";
import { selectUserId } from "@/store/userSlice";
import Error from "@/UI/components/error/Error";

function TaskStatisticsData() {
  const userId = useAppSelector(selectUserId);
  const { data, isLoading, isError, error } = useGetTasksStatisticsQuery({
    userId,
  });

  if (isLoading) {
    return (
      <Center my="md">
        <Loader type="bars" />
      </Center>
    );
  }

  if (isError) {
    return <Error isError={isError} error={error} />;
  }

  if (!data) {
    return (
      <Text fw="bold" c="blue" ta="center" my="md">
        There is no statistic data
      </Text>
    );
  }

  const progress = Math.round((100 / data.total) * data.done);

  return (
    <>
      <Text c="dimmed" ta="center" fz="sm">
        {data.total} tasks in total
      </Text>

      <Group justify="space-between" mt="xs">
        <Text fz="sm" c="dimmed">
          Progress
        </Text>
        <Text fz="sm" c="dimmed">
          {progress}%
        </Text>
      </Group>

      <Progress value={progress} mt={5} />

      <Group justify="space-between" mt="md">
        <Text fz="sm">
          {data.done} / {data.total}
        </Text>
        <Badge size="sm">{data.open} is open</Badge>
      </Group>
    </>
  );
}

export function TaskStatistics() {
  return (
    <Paper radius="md" withBorder className={classes.card} mt={20}>
      <ThemeIcon className={classes.icon} size={60} radius={60}>
        <IconTools style={{ width: rem(32), height: rem(32) }} stroke={1.5} />
      </ThemeIcon>

      <Text mb="md" ta="center" fw={700} className={classes.title}>
        Task challenge
      </Text>

      <TaskStatisticsData />
    </Paper>
  );
}
