import { Container, Grid } from "@mantine/core";

import { StatsControl, StatsGrid, StatsSegment } from "@/UI/components/stats/";
import { TaskStatistics } from "@/features/task/statistics/TaskStatistics";

export default function HomePage() {
  return (
    <Container py="md" size="lg">
      <Grid grow>
        <Grid.Col span={{ base: 12, xl: 6 }}>
          <TaskStatistics />
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 6 }}>
          <StatsControl />
        </Grid.Col>
        <Grid.Col span={12}>
          <StatsSegment />
        </Grid.Col>
        <Grid.Col span={12}>
          <StatsGrid />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
