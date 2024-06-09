import { createFormContext } from "@mantine/form";

import { SubscriptionType } from "@/constants";
import { User } from "@/store/userSlice";

export enum STEPS {
  FIRST_STEP = 0,
  SECOND_STEP = 1,
  LAST_STEP = 2,
  COMPLEAT_STEP = 3,
}

type AccountFormData = Pick<User, "firstName" | "lastName" | "age">;
type SubscriptionFormData = Pick<User, "subscribed"> & {
  subscriptions: SubscriptionType[];
};
type AvatarData = {
  [key: string]: unknown;
  image: string | null;
};

export type ProfileFormData = AccountFormData &
  SubscriptionFormData &
  AvatarData;

export const [ProfileFormProvider, useProfileFormContext, useProfileForm] =
  createFormContext<ProfileFormData>();

type ProfileFormType = ReturnType<typeof useProfileForm>;

export const validateFirstStep = (form: ProfileFormType) => {
  return (
    form.validateField("firstName").hasError ||
    form.validateField("lastName").hasError ||
    form.validateField("age").hasError
  );
};

export const validateSecondStep = (form: ProfileFormType) =>
  form.validateField("image").hasError;

export const setFormDataDefaultValues = (user: User) => ({
  image: user.avatar,
  firstName: user.firstName,
  lastName: user.lastName,
  age: user.age || 0,
  subscribed: user.subscribed,
  subscriptions: user.subscriptions.map((subscription) => subscription.name),
});
