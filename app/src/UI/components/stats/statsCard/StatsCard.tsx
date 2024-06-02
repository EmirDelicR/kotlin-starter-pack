import {
  ThemeIcon,
  Progress,
  Text,
  Group,
  Badge,
  Paper,
  rem,
} from "@mantine/core";
import { IconTools } from "@tabler/icons-react";

import classes from "./StatsCard.module.scss";

const TASK_PER_WEEK = 5;
const TASK_DONE_PER_WEEK = 4;

export function StatsCard() {
  const progress = (100 / TASK_PER_WEEK) * TASK_DONE_PER_WEEK;

  return (
    <Paper radius="md" withBorder className={classes.card} mt={20}>
      <ThemeIcon className={classes.icon} size={60} radius={60}>
        <IconTools style={{ width: rem(32), height: rem(32) }} stroke={1.5} />
      </ThemeIcon>

      <Text ta="center" fw={700} className={classes.title}>
        Task challenge
      </Text>
      <Text c="dimmed" ta="center" fz="sm">
        {TASK_PER_WEEK} tasks / week
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
          {TASK_DONE_PER_WEEK} / {TASK_PER_WEEK}
        </Text>
        <Badge size="sm">3 days left</Badge>
      </Group>
    </Paper>
  );
}
