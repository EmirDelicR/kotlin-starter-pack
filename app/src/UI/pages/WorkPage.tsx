import { Container, Grid } from '@mantine/core';

import TaskManager from '@/features/task/TaskManager';
import { TaskStatistics } from '@/features/task/statistics/TaskStatistics';

export default function WorkPage() {
  return (
    <Container size="lg" py="md">
      <Grid>
        <Grid.Col span={{ base: 7 }}>
          <TaskManager />
        </Grid.Col>
        <Grid.Col span={{ base: 5 }}>
          <TaskStatistics />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
