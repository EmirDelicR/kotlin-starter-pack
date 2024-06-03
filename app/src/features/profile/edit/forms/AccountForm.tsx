import { NumberInput, Stack, TextInput } from "@mantine/core";
import { useProfileFormContext } from "./FormContext";

export default function AccountForm() {
  const form = useProfileFormContext();

  return (
    <Stack p="md">
      <TextInput
        label="First Name"
        placeholder="Edit first name"
        data-testid="profile-first-name"
        withAsterisk
        key={form.key("firstName")}
        {...form.getInputProps("firstName")}
      />
      <TextInput
        label="Last Name"
        placeholder="Edit last name"
        data-testid="profile-last-name"
        withAsterisk
        key={form.key("lastName")}
        {...form.getInputProps("lastName")}
      />
      <NumberInput
        label="Age"
        placeholder="Edit age"
        data-testid="profile-age"
        withAsterisk
        key={form.key("age")}
        {...form.getInputProps("age")}
      />
    </Stack>
  );
}
