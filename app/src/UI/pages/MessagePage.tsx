import { Container } from '@mantine/core';

import MessageTable from '@/features/contact/messageTable/MessageTable';

export default function MessagePage() {
  return (
    <Container size="lg" py="md">
      <MessageTable />
    </Container>
  );
}
