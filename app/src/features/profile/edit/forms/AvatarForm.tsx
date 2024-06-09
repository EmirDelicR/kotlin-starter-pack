import { createDynamicArray } from "@/utils";
import { Avatar, Container, Image, Paper, Select, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { useProfileFormContext } from "./FormContext";

import classes from "./AvatarForm.module.scss";
import Error from "@/UI/components/error/Error";

const AVATAR_IMAGES = createDynamicArray(10).map((index) => {
  const idx = index + 1;
  return {
    label: `Avatar-${idx}`,
    value: `https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-${idx}.png`,
  };
});

export default function AvatarForm() {
  const form = useProfileFormContext();
  const isFitContentView = useMediaQuery("(max-width: 870px)");

  if (isFitContentView) {
    return (
      <Stack p="md" align="center">
        <Avatar size="xl" src={form.getValues().image} alt="User avatar" />
        <Select
          label="Your avatar"
          placeholder="Pick value"
          data={AVATAR_IMAGES}
          key={form.key("image")}
          {...form.getInputProps("image")}
          onChange={(value) => form.setFieldValue("image", value)}
        />
      </Stack>
    );
  }

  return (
    <Paper withBorder shadow="md">
      <Container display="flex" my="md" pos="relative" className={classes.cont}>
        <div className={classes.gallery}>
          {AVATAR_IMAGES.map((avatar) => {
            return (
              <Image
                key={avatar.label}
                alt={avatar.label}
                src={avatar.value}
                onClick={() => form.setFieldValue("image", avatar.value)}
              />
            );
          })}
        </div>
        <Avatar
          src={form.getValues().image}
          alt="User avatar"
          pos="absolute"
          className={classes.avt}
        />
      </Container>

      <Error
        isError={form.getInputProps("image").error !== undefined}
        error={{ error: form.getInputProps("image").error }}
      />
    </Paper>
  );
}
