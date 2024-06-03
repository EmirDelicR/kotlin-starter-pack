import { createDynamicArray } from "@/utils";
import { Avatar, Select, Stack } from "@mantine/core";
import { useState } from "react";
import { useProfileFormContext } from "./FormContext";

const AVATAR_IMAGES = createDynamicArray(10).map((index) => {
  const idx = index + 1;
  return {
    label: `Avatar-${idx}`,
    value: `https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-${idx}.png`,
  };
});

export default function AvatarForm() {
  const form = useProfileFormContext();

  return (
    <Stack p="md" align="center">
      <Avatar size="xl" src={form.getValues().image} alt="User avatar" />
      <Select
        label="Your avatar"
        placeholder="Pick value"
        data={AVATAR_IMAGES}
        key={form.key("image")}
        {...form.getInputProps("image")}
      />
    </Stack>
  );
}
