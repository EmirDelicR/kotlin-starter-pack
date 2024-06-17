import { Container, Grid } from '@mantine/core';

import TaskManager from '@/features/task/TaskManager';
import { TaskStatistics } from '@/features/task/statistics/TaskStatistics';

export default function WorkPage() {
  return (
    <Container size="lg" py="md">
      <Grid>
        <Grid.Col span={{ base: 12, lg: 7 }} order={{ base: 2, lg: 1 }}>
          <TaskManager />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 5 }} order={{ base: 1, lg: 2 }}>
          <TaskStatistics />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
