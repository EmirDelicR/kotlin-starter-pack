import {
  Button,
  Container,
  LoadingOverlay,
  Paper,
  PasswordInput,
  TextInput,
  Title
} from '@mantine/core';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';

import Error from '@/UI/components/error/Error';
import { VALIDATION_MESSAGES } from '@/constants';

import { useLoginMutation } from '../store/authApiSlice';
import useAuth from '../useAuth';

interface FormFields {
  email: string;
  password: string;
}

const INITIAL_FORM_VALUES: FormFields = {
  email: '',
  password: ''
};

export default function Login() {
  const [login, { isLoading, isSuccess, data, isError, error }] =
    useLoginMutation();
  const loginForm = useForm<FormFields>({
    mode: 'uncontrolled',
    initialValues: INITIAL_FORM_VALUES,
    validate: {
      email: isEmail(VALIDATION_MESSAGES.email),
      password: isNotEmpty(VALIDATION_MESSAGES.passwordRequired)
    }
  });

  useAuth(data, isSuccess);

  const handleSubmit = async (data: FormFields) => {
    await login(data);
  };

  return (
    <Container size={500} my={40}>
      <Title ta="center">Welcome back</Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md" pos="relative">
        <LoadingOverlay
          data-testid="login-loading-overlay"
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'var(--mantine-color-blue-6)', type: 'bars' }}
        />
        <form onSubmit={loginForm.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            data-testid="login-email"
            withAsterisk
            key={loginForm.key('email')}
            {...loginForm.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            data-testid="login-password"
            withAsterisk
            mt="md"
            key={loginForm.key('password')}
            {...loginForm.getInputProps('password')}
          />
          <Button type="submit" fullWidth my="xl" data-testid="login-submit">
            Login
          </Button>
        </form>
        <Error isError={isError} error={error} />
      </Paper>
    </Container>
  );
}
