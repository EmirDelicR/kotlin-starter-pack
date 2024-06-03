import { Container, Grid } from "@mantine/core";

import ProfileDetails from "@/features/profile/details/ProfileDetails";
import ContactForm from "@/features/contact/contactForm/ContactForm";

export default function ProfilePage() {
  return (
    <Container size="lg" py="md">
      <Grid grow>
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
