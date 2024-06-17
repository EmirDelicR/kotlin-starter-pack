import { Badge, Grid, Paper } from '@mantine/core';

import { Roles } from '@/constants';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/userSlice';
import { formatDate } from '@/utils';

export default function ProfileDetails() {
  const user = useAppSelector(selectUser);

  return (
    <Paper radius="md" withBorder p="lg">
      <Grid gutter={{ base: 'xs', lg: 'md' }}>
        <Grid.Col span={{ base: 12, lg: 6 }} fw="bold">
          Full name:
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Badge w="100%" color="blue">
            {user.firstName} {user.lastName}
          </Badge>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }} fw="bold">
          User name:
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Badge w="100%" color="blue">
            {user.userName}
          </Badge>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }} fw="bold">
          Email:
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Badge w="100%" color="blue">
            {user.email}
          </Badge>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }} fw="bold">
          Age:
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Badge w="100%" color="blue">
            {user.age}
          </Badge>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }} fw="bold">
          Initial login:
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Badge w="100%" color="blue">
            {formatDate(user?.createdAt || new Date())}
          </Badge>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }} fw="bold">
          Role:
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Badge w="100%" color="blue">
            {Roles[user.role?.type || 'USER']}
          </Badge>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
