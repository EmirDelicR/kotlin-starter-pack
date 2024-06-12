import { useEffect } from 'react';

import {
  Button,
  LoadingOverlay,
  Paper,
  Stack,
  TextInput,
  Textarea,
  Title
} from '@mantine/core';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import Error from '@/UI/components/error/Error';
import { VALIDATION_MESSAGES } from '@/constants';

import {
  ContactFormMessage,
  useSendMessageMutation
} from '../store/contactApiSlice';

export default function ContactForm() {
  const contactForm = useForm<ContactFormMessage>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      fullName: '',
      message: ''
    },
    validate: {
      email: isEmail(VALIDATION_MESSAGES.email),
      fullName: isNotEmpty(VALIDATION_MESSAGES.fullName),
      message: isNotEmpty(VALIDATION_MESSAGES.message)
    }
  });

  const [sendMessage, { isLoading, isError, error, isSuccess }] =
    useSendMessageMutation();

  useEffect(() => {
    if (isSuccess) {
      notifications.show({
        title: 'Success',
        message: 'Message was send successfully',
        color: 'green'
      });
    }
  }, [isSuccess]);

  const onSubmitHandler = async (data: ContactFormMessage) => {
    await sendMessage(data);
  };

  return (
    <Paper withBorder shadow="md" p="md">
      <LoadingOverlay
        data-testid="contact-loading-overlay"
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'var(--mantine-color-blue-6)', type: 'bars' }}
      />
      <form onSubmit={contactForm.onSubmit(onSubmitHandler)}>
        <Stack>
          <Title order={3}>Contact Us</Title>
          <TextInput
            name="email"
            label="Email"
            data-testid="contact-email"
            placeholder="Enter your email"
            withAsterisk
            key={contactForm.key('email')}
            {...contactForm.getInputProps('email')}
          />
          <TextInput
            name="name"
            label="Full Name"
            data-testid="contact-full-name"
            placeholder="Enter your full name"
            withAsterisk
            key={contactForm.key('fullName')}
            {...contactForm.getInputProps('fullName')}
          />
          <Textarea
            name="message"
            label="Your Message"
            data-testid="contact-message"
            placeholder="Enter your message"
            withAsterisk
            key={contactForm.key('message')}
            {...contactForm.getInputProps('message')}
          />
          <Button fullWidth type="submit" data-testid="contact-submit">
            Send message
          </Button>
        </Stack>
      </form>
      <Error isError={isError} error={error} />
    </Paper>
  );
}
