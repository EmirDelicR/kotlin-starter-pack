import { useState } from "react";
import { Button, Group, Paper, Stepper, rem } from "@mantine/core";
import { isInRange, isNotEmpty } from "@mantine/form";

import {
  IconUserCheck,
  IconMailOpened,
  IconImageInPicture,
} from "@tabler/icons-react";

import { useAppSelector } from "@/store";
import { selectUser } from "@/store/userSlice";

import {
  ProfileFormProvider,
  setFormDataDefaultValues,
  useProfileForm,
} from "./forms/FormContext";

import AccountForm from "./forms/AccountForm";
import AvatarForm from "./forms/AvatarForm";
import SubscriptionForm from "./forms/SubscriptionForm";

export default function EditProfileForm() {
  const user = useAppSelector(selectUser);
  const [active, setActive] = useState(0);

  const form = useProfileForm({
    mode: "uncontrolled",
    initialValues: setFormDataDefaultValues(user),
    validate: {
      firstName: isNotEmpty("First name is required"),
      lastName: isNotEmpty("Last name is required"),
      age: isInRange({ min: 1, max: 120 }, "Age must be provided"),
      image: isNotEmpty("Avatar must be set"),
    },
  });

  const validateFirstStep = () => {
    return (
      form.validateField("firstName").hasError ||
      form.validateField("lastName").hasError ||
      form.validateField("age").hasError
    );
  };

  const validateSecondStep = () => form.validateField("image").hasError;

  const nextStep = () => {
    setActive((current) => {
      if (current === 0 && validateFirstStep()) {
        return 0;
      }

      if (current === 1 && validateSecondStep()) {
        return 1;
      }
      return current < 2 ? current + 1 : current;
    });
  };
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Paper withBorder shadow="md" p="md">
      <ProfileFormProvider form={form}>
        <form onSubmit={form.onSubmit(() => {})}>
          <Stepper active={active} onStepClick={setActive}>
            <Stepper.Step
              description="Data"
              icon={
                <IconUserCheck style={{ width: rem(18), height: rem(18) }} />
              }
            >
              <AccountForm />
            </Stepper.Step>
            <Stepper.Step
              description="Avatar"
              icon={
                <IconImageInPicture
                  style={{ width: rem(18), height: rem(18) }}
                />
              }
            >
              <AvatarForm />
            </Stepper.Step>
            <Stepper.Step
              description="Subscriptions"
              icon={
                <IconMailOpened style={{ width: rem(18), height: rem(18) }} />
              }
            >
              <SubscriptionForm />
            </Stepper.Step>
          </Stepper>
          <Group justify="center" mt="xl">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Next step</Button>
          </Group>
        </form>
      </ProfileFormProvider>
    </Paper>
  );
}
