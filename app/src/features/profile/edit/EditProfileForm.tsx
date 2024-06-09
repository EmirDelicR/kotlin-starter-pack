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
  STEPS,
  setFormDataDefaultValues,
  useProfileForm,
  validateFirstStep,
  validateSecondStep,
} from "./forms/FormContext";

import AccountForm from "./forms/AccountForm";
import AvatarForm from "./forms/AvatarForm";
import SubscriptionForm from "./forms/SubscriptionForm";

const FORM_STEPS = [
  {
    description: "Data",
    icon: <IconUserCheck style={{ width: rem(18), height: rem(18) }} />,
    form: <AccountForm />,
  },
  {
    description: "Avatar",
    icon: <IconImageInPicture style={{ width: rem(18), height: rem(18) }} />,
    form: <AvatarForm />,
  },
  {
    description: "Subscriptions",
    icon: <IconMailOpened style={{ width: rem(18), height: rem(18) }} />,
    form: <SubscriptionForm />,
  },
];

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

  const onStepIconClick = (stepIndex: number) => {
    setActive((current) => {
      if (current > stepIndex) {
        return stepIndex;
      }

      if (current === STEPS.FIRST_STEP && validateFirstStep(form)) {
        return STEPS.FIRST_STEP;
      }

      if (current === STEPS.SECOND_STEP && validateSecondStep(form)) {
        return STEPS.SECOND_STEP;
      }

      return stepIndex;
    });
  };

  const nextStep = () => {
    setActive((current) => {
      if (current === STEPS.FIRST_STEP && validateFirstStep(form)) {
        return STEPS.FIRST_STEP;
      }

      if (current === STEPS.SECOND_STEP && validateSecondStep(form)) {
        return STEPS.SECOND_STEP;
      }

      return current < STEPS.LAST_STEP ? current + 1 : current;
    });
  };

  const prevStep = () =>
    setActive((current) =>
      current > STEPS.FIRST_STEP ? current - 1 : current
    );

  const handleSubmit = async (data: any) => {
    console.log("Data in handle: ", data);
  };

  return (
    <Paper withBorder shadow="md" p="md">
      <ProfileFormProvider form={form}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stepper active={active} onStepClick={onStepIconClick}>
            {FORM_STEPS.map((item) => (
              <Stepper.Step
                description={item.description}
                icon={item.icon}
                key={item.description}
              >
                {item.form}
              </Stepper.Step>
            ))}
            <Stepper.Completed>
              Completed, click back button to get to previous step
            </Stepper.Completed>
          </Stepper>
          <Group justify="center" mt="xl">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            {/* {active === STEPS.LAST_STEP ? (
              <Button type="submit">Submit</Button>
            ) : (
              <Button onClick={nextStep}>Next step</Button>
            )} */}
            <Button onClick={nextStep}>Next step</Button>
          </Group>
        </form>
      </ProfileFormProvider>
    </Paper>
  );
}
