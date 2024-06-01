import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";

import { useLoginMutation } from "../store/authApiSlice";
import useAuth from "../useAuth";

import { Error } from "@/UI/components/error/Error";

interface FormFields {
  email: string;
  password: string;
}

const INITIAL_FORM_VALUES: FormFields = {
  email: "",
  password: "",
};

export default function Login() {
  const [login, { isLoading, isSuccess, data, isError, error }] =
    useLoginMutation();
  const form = useForm<FormFields>({
    mode: "uncontrolled",
    initialValues: INITIAL_FORM_VALUES,
    validate: {
      email: isEmail("Your email is not valid!"),
      password: isNotEmpty("Enter your password!"),
    },
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
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: "var(--mantine-color-blue-6)", type: "bars" }}
        />
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
          <PasswordInput
            withAsterisk
            label="Password"
            placeholder="Your password"
            mt="md"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />
          <Button type="submit" fullWidth my="xl">
            Login
          </Button>
        </form>
        <Error isError={isError} error={error} />
      </Paper>
    </Container>
  );
}
