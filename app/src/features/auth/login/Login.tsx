import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
} from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";

interface FormFields {
  email: string;
  password: string;
}

const INITIAL_FORM_VALUES: FormFields = {
  email: "",
  password: "",
};

export default function Login() {
  const form = useForm<FormFields>({
    mode: "uncontrolled",
    initialValues: INITIAL_FORM_VALUES,
    validate: {
      email: isEmail("Your email is not valid!"),
      password: isNotEmpty("Enter your password!"),
    },
  });

  const handleSubmit = (values: FormFields) => {
    // TODO submit form here
    console.log(values);
  };

  return (
    <Container size={500} my={40}>
      <Title ta="center">Welcome back</Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
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
          <Button type="submit" fullWidth mt="xl">
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
