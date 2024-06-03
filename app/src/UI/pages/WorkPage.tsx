import TaskManager from "@/features/task/TaskManager";
import { Container } from "@mantine/core";

export default function WorkPage() {
  return (
    <Container size="lg" py="md">
      <TaskManager />
    </Container>
  );
}
