import {
  Box,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  PasswordInput,
  TextInput,
  Title
} from '@mantine/core';
import { isEmail, isNotEmpty, matches, useForm } from '@mantine/form';

import Error from '@/UI/components/error/Error';
import HelpPopover from '@/UI/components/helpPopover/HelpPopover.tsx';
import { PASSWORD_PATTERNS, VALIDATION_MESSAGES } from '@/constants';

import { useRegisterMutation } from '../store/authApiSlice';
import useAuth from '../useAuth';

interface FormFields {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName?: string;
}

const INITIAL_FORM_VALUES: FormFields = {
  firstName: '',
  lastName: '',
  userName: '',
  email: '',
  password: ''
};

export default function Register() {
  const [registerUser, { isLoading, data, isSuccess, isError, error }] =
    useRegisterMutation();

  const registerForm = useForm<FormFields>({
    mode: 'uncontrolled',
    initialValues: INITIAL_FORM_VALUES,
    validate: {
      email: isEmail(VALIDATION_MESSAGES.email),
      password: matches(PASSWORD_PATTERNS, VALIDATION_MESSAGES.password),
      firstName: isNotEmpty(VALIDATION_MESSAGES.firstName),
      lastName: isNotEmpty(VALIDATION_MESSAGES.lastName)
    }
  });

  useAuth(data, isSuccess);

  const handleSubmit = async (data: FormFields) => {
    await registerUser(data);
  };

  return (
    <Container size={500} my={40}>
      <Title ta="center">Welcome aboard</Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md" pos="relative">
        <LoadingOverlay
          data-testid="register-loading-overlay"
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'var(--mantine-color-blue-6)', type: 'bars' }}
        />
        <form onSubmit={registerForm.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            placeholder="Your first name"
            data-testid="register-first-name"
            withAsterisk
            mb="md"
            key={registerForm.key('firstName')}
            {...registerForm.getInputProps('firstName')}
          />
          <TextInput
            label="Surname"
            placeholder="Your last name"
            data-testid="register-last-name"
            withAsterisk
            mb="md"
            key={registerForm.key('lastName')}
            {...registerForm.getInputProps('lastName')}
          />
          <TextInput
            label="Username"
            placeholder="Your user name"
            data-testid="register-user-name"
            mb="md"
            key={registerForm.key('userName')}
            {...registerForm.getInputProps('userName')}
          />
          <TextInput
            label="Email"
            placeholder="your@email.com"
            data-testid="register-email"
            withAsterisk
            mb="md"
            key={registerForm.key('email')}
            {...registerForm.getInputProps('email')}
          />
          <Group justify="space-between" gap="sm" align={'center'}>
            <Box flex={1} mih="85px">
              <PasswordInput
                label="Password"
                placeholder="Your password"
                data-testid="register-password"
                withAsterisk
                key={registerForm.key('password')}
                {...registerForm.getInputProps('password')}
              />
            </Box>
            <HelpPopover hintText="Password must contain minimum 8 characters,one number and one of this special signs !#$%&()*+,-/:;<=>?" />
          </Group>
          <Button type="submit" fullWidth mt="my" data-testid="register-submit">
            Register
          </Button>
        </form>
        <Error isError={isError} error={error} />
      </Paper>
    </Container>
  );
}
