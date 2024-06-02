import { Container, Grid } from "@mantine/core";

import {
  StatsCard,
  StatsControl,
  StatsGrid,
  StatsSegment,
} from "@/UI/components/stats/";

export default function HomePage() {
  return (
    <Container fluid py="md">
      <Grid grow>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <StatsCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
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
