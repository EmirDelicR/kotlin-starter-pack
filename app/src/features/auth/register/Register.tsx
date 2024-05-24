import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Group,
  Box,
} from "@mantine/core";
import { isEmail, isNotEmpty, matches, useForm } from "@mantine/form";
import { PASSWORD_PATTERNS } from "@/constants/patterns.ts";
import HelpPopover from "@/UI/components/helpPopover/HelpPopover.tsx";

interface FormFields {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName?: string;
}

const INITIAL_FORM_VALUES: FormFields = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  password: "",
};

export default function Register() {
  const form = useForm<FormFields>({
    mode: "uncontrolled",
    initialValues: INITIAL_FORM_VALUES,
    validate: {
      email: isEmail("Your email is not valid!"),
      password: matches(
        PASSWORD_PATTERNS,
        "Your password is not strong enough!"
      ),
      firstName: isNotEmpty("Enter your first name!"),
      lastName: isNotEmpty("Enter your last name!"),
    },
  });

  const handleSubmit = (values: FormFields) => {
    // TODO submit form here
    console.log(values);
  };

  return (
    <Container size={500} my={40}>
      <Title ta="center">Welcome aboard</Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Your first name"
            mb="md"
            key={form.key("firstName")}
            {...form.getInputProps("firstName")}
          />
          <TextInput
            withAsterisk
            label="Surname"
            placeholder="Your last name"
            mb="md"
            key={form.key("lastName")}
            {...form.getInputProps("lastName")}
          />
          <TextInput
            label="User name"
            placeholder="Your user name"
            mb="md"
            key={form.key("userName")}
            {...form.getInputProps("userName")}
          />
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            mb="md"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
          <Group justify="space-between" gap="sm" align={"center"}>
            <Box flex={1} mih="85px">
              <PasswordInput
                withAsterisk
                label="Password"
                placeholder="Your password"
                key={form.key("password")}
                {...form.getInputProps("password")}
              />
            </Box>
            <HelpPopover hintText="Password must contain minimum 8 characters,one number and one of this special signs !#$%&()*+,-/:;<=>?" />
          </Group>
          <Button type="submit" fullWidth mt="md">
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
