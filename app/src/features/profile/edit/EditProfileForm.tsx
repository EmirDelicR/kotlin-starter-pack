import { useEffect, useState } from 'react';

import {
  Button,
  Group,
  Loader,
  Paper,
  Stack,
  Stepper,
  Title,
  rem
} from '@mantine/core';
import { isInRange, isNotEmpty } from '@mantine/form';
import {
  IconImageInPicture,
  IconMailOpened,
  IconUserCheck
} from '@tabler/icons-react';

import Error from '@/UI/components/error/Error';
import { VALIDATION_MESSAGES } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectUser, setUser } from '@/store/userSlice';
import { useUpdateUserMutation } from '@/store/userSlice/userApiSlice';

import AccountForm from './forms/AccountForm';
import AvatarForm from './forms/AvatarForm';
import {
  ProfileFormData,
  ProfileFormProvider,
  STEPS,
  setFormDataDefaultValues,
  useProfileForm,
  validateFirstStep,
  validateSecondStep
} from './forms/FormContext';
import SubscriptionForm from './forms/SubscriptionForm';

const FORM_STEPS = [
  {
    description: 'Data',
    icon: <IconUserCheck style={{ width: rem(18), height: rem(18) }} />,
    form: <AccountForm />
  },
  {
    description: 'Avatar',
    icon: <IconImageInPicture style={{ width: rem(18), height: rem(18) }} />,
    form: <AvatarForm />
  },
  {
    description: 'Subscriptions',
    icon: <IconMailOpened style={{ width: rem(18), height: rem(18) }} />,
    form: <SubscriptionForm />
  }
];

interface Props {
  onSuccessCallback: () => void;
}

export default function EditProfileForm({ onSuccessCallback }: Props) {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [active, setActive] = useState(0);

  const [updateUser, { isLoading, data, isError, error, isSuccess }] =
    useUpdateUserMutation();

  const form = useProfileForm({
    mode: 'uncontrolled',
    initialValues: setFormDataDefaultValues(user),
    validate: {
      firstName: isNotEmpty(VALIDATION_MESSAGES.firstName),
      lastName: isNotEmpty(VALIDATION_MESSAGES.lastName),
      age: isInRange({ min: 1, max: 120 }, VALIDATION_MESSAGES.age),
      avatar: isNotEmpty(VALIDATION_MESSAGES.image)
    }
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
      onSuccessCallback();
    }
  }, [isSuccess]);

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

      return current < STEPS.COMPLEAT_STEP ? current + 1 : current;
    });
  };

  const prevStep = () =>
    setActive((current) =>
      current > STEPS.FIRST_STEP ? current - 1 : current
    );

  const handleSubmit = async (formData: ProfileFormData) => {
    await updateUser({ formData, userId: user.id });
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
              <Stack align="center" my="md" w="100%">
                <Title order={4}>Updating profile</Title>
                {isLoading && <Loader type="bars" />}
                <Error isError={isError} error={error} />
              </Stack>
            </Stepper.Completed>
          </Stepper>
          <Group justify="center" mt="xl">
            <Button
              variant="default"
              onClick={prevStep}
              disabled={active === STEPS.FIRST_STEP || isLoading}
            >
              Back
            </Button>
            {active === STEPS.COMPLEAT_STEP ? (
              <Button disabled={isLoading} type="submit">
                Submit
              </Button>
            ) : (
              <Button onClick={nextStep}>
                {active === STEPS.LAST_STEP ? 'Submit' : 'Next step'}
              </Button>
            )}
          </Group>
        </form>
      </ProfileFormProvider>
    </Paper>
  );
}
