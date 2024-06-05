import { Container } from "@mantine/core";

import TaskManager from "@/features/task/TaskManager";

export default function WorkPage() {
  return (
    <Container size="lg" py="md">
      <TaskManager />
    </Container>
  );
}
