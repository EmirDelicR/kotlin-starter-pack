import { Container, Grid } from '@mantine/core';

import ContactForm from '@/features/contact/contactForm/ContactForm';
import MinimalDetails from '@/features/profile/details/MinimalDetails';
import ProfileDetails from '@/features/profile/details/ProfileDetails';
import SubscriptionDetails from '@/features/profile/details/SubscriptionDetails';

export default function ProfilePage() {
  return (
    <Container size="lg" py="md">
      <Grid gutter={{ base: 'xs', lg: 'md' }} grow>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <MinimalDetails />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <SubscriptionDetails />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <ProfileDetails />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <ContactForm />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
